'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { romanaChapters } from '@/lib/lessons';
import { useAuth } from '@/hooks/useAuth';
import { saveTestResult } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronLeft, RefreshCw, Trophy, ChevronRight } from 'lucide-react';

interface Question { text: string; options: string[]; correctAnswer: string; explanation: string; }

const quizData: { [key: string]: Question[] } = {
  'test-substantivul': [
    { text: 'În propoziția "Mihai a citit o carte interesantă.", care este substantivul comun?', options: ['Mihai', 'carte', 'interesantă'], correctAnswer: 'carte', explanation: '"Carte" este un substantiv comun pentru că denumește o clasă de obiecte, nu unul specific.' },
    { text: 'Care dintre următoarele substantive este de genul neutru?', options: ['student', 'profesoară', 'scaun'], correctAnswer: 'scaun', explanation: 'Numărăm "un scaun, două scaune", deci este genul neutru.' },
    { text: 'Identifică substantivul propriu din următoarea serie: "oraș, munte, Carpați, râu".', options: ['oraș', 'munte', 'Carpați', 'râu'], correctAnswer: 'Carpați', explanation: '"Carpați" denumește un lanț muntos specific și se scrie cu majusculă.' },
  ],
  'test-adjectivul': [
    { text: 'Care este gradul de comparație al adjectivului din sintagma "cel mai înalt copac"?', options: ['Pozitiv', 'Comparativ de Superioritate', 'Superlativ Relativ'], correctAnswer: 'Superlativ Relativ', explanation: 'Folosirea articolului "cel" indică un superlativ relativ.' },
    { text: 'În propoziția "Floarea este parfumată.", ce funcție sintactică are "parfumată"?', options: ['Subiect', 'Nume predicativ', 'Atribut adjectival'], correctAnswer: 'Nume predicativ', explanation: 'Face parte din predicatul nominal "este parfumată", alături de verbul copulativ "este".' },
  ]
};

export default function QuizPage({ params }: { params: { quizSlug: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const lesson = romanaChapters.flatMap(c => c.lessons).find(l => l.quizSlug === params.quizSlug);
  const questions = quizData[params.quizSlug];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    if (isFinished || timeLeft === 0) {
      clearInterval(timer);
      if (!isFinished) handleSubmit();
    }
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  if (!lesson || !questions) { notFound(); }

  const handleAnswerSelect = (answer: string) => setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  
  const handleSubmit = async () => {
    let finalScore = 0;
    questions.forEach((q, index) => { if (selectedAnswers[index] === q.correctAnswer) finalScore++; });
    setScore(finalScore);
    setIsFinished(true);
    if (user) { await saveTestResult(user.uid, params.quizSlug, finalScore, questions.length); }
  };

  const handleRestart = () => { /* ... logica de restart ... */ };

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50"><main className="flex-1">
      <div className="container py-12 md:py-20"><div className="max-w-2xl mx-auto">
        <Button asChild variant="outline" className="mb-6"><Link href={`/materii/romana/${lesson.slug}`}><ChevronLeft className="h-4 w-4 mr-2" /> Înapoi la lecția "{lesson.title}"</Link></Button>
        {isFinished ? (
          <Card className="text-center">
            <CardHeader><Trophy className={cn('h-16 w-16 mx-auto', (score / questions.length) >= 0.5 ? 'text-amber-500' : 'text-gray-400')} /><CardTitle className="text-3xl mt-4">Test finalizat!</CardTitle><CardDescription>Ai răspuns corect la {score} din {questions.length} întrebări.</CardDescription></CardHeader>
            <CardContent><p className="text-5xl font-bold">{Math.round((score / questions.length) * 100)}%</p><div className="flex justify-center gap-4 mt-8"><Button onClick={handleRestart}><RefreshCw className="mr-2 h-4 w-4" /> Refă Testul</Button><Button asChild variant="outline"><Link href="/materii/romana">Alte lecții</Link></Button></div></CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader><CardDescription>Test: {lesson.title} | Întrebarea {currentQuestionIndex + 1} / {questions.length}</CardDescription><CardTitle className="text-xl">{currentQuestion.text}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">{currentQuestion.options.map((option, index) => (<Button key={index} variant="outline" className={cn("justify-start h-auto py-3 text-left", selectedAnswer === option && 'bg-primary/10 border-primary')} onClick={() => handleAnswerSelect(option)}>{option}</Button>))}</div>
              <div className="flex justify-end mt-8">
                {currentQuestionIndex < questions.length - 1 ? (<Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} disabled={!selectedAnswer}>Următoarea Întrebare <ChevronRight className="h-4 w-4 ml-2" /></Button>) : (<Button onClick={handleSubmit} disabled={!selectedAnswer}>Finalizează Testul</Button>)}
              </div>
            </CardContent>
          </Card>
        )}
      </div></div>
    </main><Footer /></div>
  );
}