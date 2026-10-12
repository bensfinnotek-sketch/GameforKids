import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { LESSON_REWARDS, getLevelInfo } from './lessonRewards';
import { INITIAL_LESSONS, getQuestionsForLesson } from '../src/data/mockData';

function getVietnamDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return values.year + '-' + values.month + '-' + values.day;
}

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
    let body: any;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    const lessonId=typeof body.lessonId==='string'?body.lessonId:'';
    const attemptId=typeof body.attemptId==='string'?body.attemptId:'';
    const totalQuestions=body.totalQuestions, sessionId=typeof body.sessionId==='string'?body.sessionId:'', answers=body.answers;
    const lesson=LESSON_REWARDS[lessonId];
    if(!lesson||!/^[-A-Za-z0-9_]{8,80}$/.test(attemptId)||!/^[-A-Za-z0-9_]{10,100}$/.test(sessionId))return Response.json({error:'Invalid lesson attempt'},{status:400});
    if(!Number.isInteger(totalQuestions)||totalQuestions!==lesson.totalQuestions||!Array.isArray(answers)||answers.length!==totalQuestions||answers.some((answer:unknown)=>typeof answer!=='string'||answer.length>200))return Response.json({error:'Invalid lesson answers'},{status:400});
    const lessonDefinition=INITIAL_LESSONS.find((item)=>item.id===lessonId);
    if(!lessonDefinition)return Response.json({error:'Lesson definition not found'},{status:409});
    const questions=getQuestionsForLesson(lessonDefinition);
    if(questions.length!==totalQuestions)return Response.json({error:'Lesson question bank mismatch'},{status:409});
    const score=questions.reduce((sum: number, question: any, index: number)=>{
      const answer=answers[index];
      if(question.type==='fill-number'){
        const expected=String(question.correctFillValue??question.options.find((option:any)=>option.isCorrect)?.text??'');
        return sum+(answer.trim()===expected.trim()?1:0);
      }
      const correctOption=question.options.find((option:any)=>option.isCorrect);
      return sum+(correctOption&&answer===correctOption.id?1:0);
    },0);
    const db=getFirestore(adminApp()), userRef=db.collection('users').doc(decoded.uid), attemptRef=userRef.collection('lessonAttempts').doc(attemptId), sessionRef=userRef.collection('lessonSessions').doc(sessionId);
    const result=await db.runTransaction(async tx=>{
      const userSnap=await tx.get(userRef), attemptSnap=await tx.get(attemptRef);
      if(attemptSnap.exists){const data=attemptSnap.data()||{};return {duplicate:true,xpEarned:0,coinEarned:0,gemEarned:0,stars:Number(data.starsEarned||1),accuracy:Number(data.accuracy||0),newLevel:Number(userSnap.data()?.level||1),streak:Number(userSnap.data()?.streak||0),timeSpentSeconds:Number(data.timeSpentSeconds||0),score:Number(data.score||0),totalQuestions:Number(data.totalQuestions||0)};}
      if(!userSnap.exists)throw new Error('USER_PROFILE_NOT_FOUND');
      const sessionSnap=await tx.get(sessionRef);
      if(!sessionSnap.exists)throw new Error('LESSON_SESSION_NOT_FOUND');
      const session=sessionSnap.data()||{}, nowMs=Date.now();
      if(session.status!=='active'||session.lessonId!==lessonId||!Number.isFinite(session.startedAtMs)||!Number.isFinite(session.expiresAtMs)||nowMs>session.expiresAtMs)throw new Error('LESSON_SESSION_INVALID');
      const timeSpentSeconds=Math.min(600,Math.max(0,Math.floor((nowMs-session.startedAtMs)/1000)));
      const user=userSnap.data()||{}, accuracy=Math.round(score/totalQuestions*100), stars=accuracy>=95?3:accuracy>=80?2:1;
      const isFirstLessonCompletion = !Array.isArray(user.completedLessons) || !user.completedLessons.includes(lessonId); const xpEarned=isFirstLessonCompletion?lesson.xpReward+(stars===3?20:stars===2?10:0):0, coinEarned=isFirstLessonCompletion?lesson.coinReward:0, gemEarned=isFirstLessonCompletion?lesson.gemReward:0;
      const newXp=Number(user.xp||0)+xpEarned, newLevel=Math.max(Number(user.level||1),getLevelInfo(newXp).level);
      const now = new Date();
      const today = getVietnamDateKey(now);
      const lastActive=typeof user.lastActiveDate==='string'?user.lastActiveDate:'';
      const yesterdayKey = getVietnamDateKey(new Date(now.getTime() - 24 * 60 * 60 * 1000));
      const currentStreak=Number(user.streak||0);
      const nextStreak=lastActive===today?currentStreak:(lastActive===yesterdayKey?currentStreak+1:1);
      const dailyChallengeProgress=user.dailyChallengeDate===today&&user.dailyChallengeProgress&&typeof user.dailyChallengeProgress==='object'?{...user.dailyChallengeProgress}:{}, dailyChallengeClaims=user.dailyChallengeDate===today&&user.dailyChallengeClaims&&typeof user.dailyChallengeClaims==='object'?{...user.dailyChallengeClaims}:{}; const dailyChallengeStudyLessons=user.dailyChallengeDate===today&&user.dailyChallengeStudyLessons&&typeof user.dailyChallengeStudyLessons==='object'?{...user.dailyChallengeStudyLessons}:{}; const isFirstDailyStudy = dailyChallengeStudyLessons[lessonId] !== true; if (isFirstDailyStudy) { dailyChallengeProgress['dc-1']=Number(dailyChallengeProgress['dc-1']||0)+1; dailyChallengeProgress['dc-4']=Number(dailyChallengeProgress['dc-4']||0)+score; dailyChallengeProgress['dc-5']=Number(dailyChallengeProgress['dc-5']||0)+Math.min(timeSpentSeconds,600)/60; dailyChallengeStudyLessons[lessonId]=true; } dailyChallengeProgress['dc-3']=Math.max(Number(dailyChallengeProgress['dc-3']||0),accuracy===100?1:0); const completed=Array.isArray(user.completedLessons)?user.completedLessons:[], lessonStars=user.lessonStars&&typeof user.lessonStars==='object'?user.lessonStars:{}, history=Array.isArray(user.history)?user.history:[];
      const nextCompleted=completed.includes(lessonId)?completed:[...completed,lessonId];
      const nextHistory=[...history,{id:attemptId,lessonId,lessonTitle:lesson.title,category:lesson.category,completedAt:new Date().toISOString(),score,totalQuestions,xpEarned,accuracy,starsEarned:stars,timeSpentSeconds}];
      tx.set(attemptRef,{uid:decoded.uid,lessonId,sessionId,score,totalQuestions,answers,timeSpentSeconds,accuracy,starsEarned:stars,xpEarned,coinEarned,gemEarned,submittedAt:FieldValue.serverTimestamp()});
      tx.update(sessionRef,{status:'completed',completedAt:FieldValue.serverTimestamp(),creditedSeconds:timeSpentSeconds});
      tx.update(userRef,{xp:newXp,level:newLevel,coin:Number(user.coin||0)+coinEarned,gem:Number(user.gem||0)+gemEarned,streak:nextStreak,lastActiveDate:today,completedLessons:nextCompleted,lessonStars:{...lessonStars,[lessonId]:Math.max(Number(lessonStars[lessonId]||0),stars)},history:nextHistory,dailyChallengeDate:today,dailyChallengeProgress,dailyChallengeClaims,dailyChallengeStudyLessons,updatedAt:FieldValue.serverTimestamp()});
      return {duplicate:false,xpEarned,coinEarned,gemEarned,stars,accuracy,score,totalQuestions,newLevel,streak:nextStreak,timeSpentSeconds};
    });
    return Response.json({ok:true,...result});
  }catch(error){
    const message=error instanceof Error?error.message:'Unknown error';
    if(message==='USER_PROFILE_NOT_FOUND')return Response.json({error:'Profile not found'},{status:404});
    if(message==='LESSON_SESSION_NOT_FOUND')return Response.json({error:'Lesson session not found'},{status:400});
    if(message==='LESSON_SESSION_INVALID')return Response.json({error:'Lesson session is invalid or expired'},{status:409});
    if(message.includes('Firebase ID token')||message.includes('Decoding Firebase ID token'))return Response.json({error:'Invalid authentication token'},{status:401});
    console.error('lesson-attempt reward error',error);
    return Response.json({error:'Unable to process lesson attempt'},{status:500});
  }
}
