import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { LESSON_REWARDS, getLevelInfo } from './lessonRewards';

function adminApp(){
  if(getApps().length)return getApps()[0];
  const key=process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g,'\n');
  if(!process.env.FIREBASE_PROJECT_ID||!process.env.FIREBASE_CLIENT_EMAIL||!key)throw new Error('Missing Firebase Admin environment variables');
  return initializeApp({credential:cert({projectId:process.env.FIREBASE_PROJECT_ID,clientEmail:process.env.FIREBASE_CLIENT_EMAIL,privateKey:key})});
}

export async function POST(request:Request){
  if(request.headers.get('content-type')?.split(';')[0]!=='application/json')return Response.json({error:'Content-Type must be application/json'},{status:415});
  try{
    const h=request.headers.get('authorization')||'';
    if(!h.startsWith('Bearer '))return Response.json({error:'Missing authentication token'},{status:401});
    const decoded=await getAuth(adminApp()).verifyIdToken(h.slice(7));
    const body=await request.json();
    const lessonId=typeof body.lessonId==='string'?body.lessonId:'';
    const attemptId=typeof body.attemptId==='string'?body.attemptId:'';
    const score=Number(body.score), totalQuestions=Number(body.totalQuestions), timeSpentSeconds=Number(body.timeSpentSeconds);
    const lesson=LESSON_REWARDS[lessonId];
    if(!lesson||!/^[-A-Za-z0-9_]{8,80}$/.test(attemptId))return Response.json({error:'Invalid lesson attempt'},{status:400});
    if(!Number.isInteger(score)||!Number.isInteger(totalQuestions)||!Number.isInteger(timeSpentSeconds)||totalQuestions!==lesson.totalQuestions||score<0||score>totalQuestions||timeSpentSeconds<0||timeSpentSeconds>86400)return Response.json({error:'Invalid lesson result'},{status:400});
    const db=getFirestore(adminApp()), userRef=db.collection('users').doc(decoded.uid), attemptRef=userRef.collection('lessonAttempts').doc(attemptId);
    const result=await db.runTransaction(async tx=>{
      const userSnap=await tx.get(userRef), attemptSnap=await tx.get(attemptRef);
      if(attemptSnap.exists){const data=attemptSnap.data()||{};return {duplicate:true,xpEarned:0,coinEarned:0,gemEarned:0,stars:Number(data.starsEarned||1),accuracy:Number(data.accuracy||0),newLevel:Number(userSnap.data()?.level||1)};}
      if(!userSnap.exists)throw new Error('USER_PROFILE_NOT_FOUND');
      const user=userSnap.data()||{}, accuracy=Math.round(score/totalQuestions*100), stars=accuracy>=95?3:accuracy>=80?2:1;
      const xpEarned=lesson.xpReward+(stars===3?20:stars===2?10:0), coinEarned=lesson.coinReward, gemEarned=lesson.gemReward;
      const newXp=Number(user.xp||0)+xpEarned, newLevel=Math.max(Number(user.level||1),getLevelInfo(newXp).level);
      const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh'}).format(new Date());
      const lastActive=typeof user.lastActiveDate==='string'?user.lastActiveDate:'';
      const yesterday=new Date(`${today}T00:00:00+07:00`); yesterday.setDate(yesterday.getDate()-1);
      const yesterdayKey=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh'}).format(yesterday);
      const currentStreak=Number(user.streak||0);
      const nextStreak=lastActive===today?currentStreak:(lastActive===yesterdayKey?currentStreak+1:1);
      const completed=Array.isArray(user.completedLessons)?user.completedLessons:[], lessonStars=user.lessonStars&&typeof user.lessonStars==='object'?user.lessonStars:{}, history=Array.isArray(user.history)?user.history:[];
      const nextCompleted=completed.includes(lessonId)?completed:[...completed,lessonId];
      const nextHistory=[...history,{id:attemptId,lessonId,lessonTitle:lesson.title,category:lesson.category,completedAt:new Date().toISOString(),score,totalQuestions,xpEarned,accuracy,starsEarned:stars,timeSpentSeconds}];
      tx.set(attemptRef,{uid:decoded.uid,lessonId,score,totalQuestions,timeSpentSeconds,accuracy,starsEarned:stars,xpEarned,coinEarned,gemEarned,submittedAt:FieldValue.serverTimestamp()});
      tx.update(userRef,{xp:newXp,level:newLevel,coin:Number(user.coin||0)+coinEarned,gem:Number(user.gem||0)+gemEarned,streak:nextStreak,lastActiveDate:today,completedLessons:nextCompleted,lessonStars:{...lessonStars,[lessonId]:Math.max(Number(lessonStars[lessonId]||0),stars)},history:nextHistory,dailyChallengeDate:today,dailyChallengeProgress,dailyChallengeClaims,updatedAt:FieldValue.serverTimestamp()});
      return {duplicate:false,xpEarned,coinEarned,gemEarned,stars,accuracy,newLevel,streak:nextStreak};
    });
    return Response.json({ok:true,...result});
  }catch(error){
    const message=error instanceof Error?error.message:'Unknown error';
    if(message==='USER_PROFILE_NOT_FOUND')return Response.json({error:'Profile not found'},{status:404});
    console.error('lesson-attempt reward error',error);
    return Response.json({error:'Unable to process lesson attempt'},{status:500});
  }
}
