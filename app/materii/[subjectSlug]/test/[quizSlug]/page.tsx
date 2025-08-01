// app/materii/[subjectSlug]/test/[quizSlug]/page.tsx

'use client';

import { useState, useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { quizzes } from '@/lib/quizzes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, X, ChevronLeft, Award, Repeat, Lightbulb, TrendingUp, BrainCircuit } from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizPage() {
    const params = useParams();
    const subjectSlug = params.subjectSlug as string;
    const quizSlug = params.quizSlug as string;

    const quiz = quizzes[quizSlug];

    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Array<number | null>>(() => 
        quiz ? Array(quiz.questions.length).fill(null) : []
    );
    const [isFinished, setIsFinished] = useState(false);

    // FINAL FIX 1: Am rescris logica useMemo pentru a fi 100% explicită pentru TypeScript.
    const score = useMemo(() => {
        if (!quiz) return 0;
        
        let correctAnswersCount = 0;
        selectedAnswers.forEach((answer, index) => {
            if (answer !== null && answer === quiz.questions[index]?.correctAnswerIndex) {
                correctAnswersCount++;
            }
        });
        return correctAnswersCount;
    }, [selectedAnswers, quiz]);

    if (!quiz) {
        notFound();
    }

    const handleAnswerSelect = (optionIndex: number) => {
        if (isFinished) return;
        const newAnswers = [...selectedAnswers];
        newAnswers[activeQuestionIndex] = optionIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleRetryQuiz = () => {
        setActiveQuestionIndex(0);
        setSelectedAnswers(Array(quiz.questions.length).fill(null));
        setIsFinished(false);
    };

    const goToNextQuestion = () => {
        if (activeQuestionIndex < quiz.questions.length - 1) {
            setActiveQuestionIndex(prev => prev + 1);
        }
    };
    
    const goToPreviousQuestion = () => {
        if (activeQuestionIndex > 0) {
            setActiveQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmitQuiz = () => {
        setIsFinished(true);
    };
    
    const getResultMessage = (currentScore: number) => {
        const percentage = quiz.questions.length > 0 ? (currentScore / quiz.questions.length) * 100 : 0;
        if (percentage === 100) return { icon: <Award className="h-16 w-16 text-amber-400 mx-auto" />, title: "Excepțional!", message: "Ai răspuns corect la toate întrebările. Ești pregătit!" };
        if (percentage >= 75) return { icon: <TrendingUp className="h-16 w-16 text-green-500 mx-auto" />, title: "Foarte Bine!", message: "Un scor excelent! Ești pe drumul cel bun." };
        if (percentage >= 50) return { icon: <BrainCircuit className="h-16 w-16 text-blue-500 mx-auto" />, title: "Continuă să exersezi!", message: "Un rezultat bun. Recapitulează greșelile pentru a te perfecționa." };
        return { icon: <Repeat className="h-16 w-16 text-red-500 mx-auto" />, title: "Mai încearcă!", message: "Fiecare greșeală este o oportunitate de a învăța. Nu renunța!" };
    };

    const currentQuestion = quiz.questions[activeQuestionIndex];
    const progress = quiz.questions.length > 0 ? ((activeQuestionIndex + 1) / quiz.questions.length) * 100 : 0;
    const selectedAnswerForCurrentQuestion = selectedAnswers[activeQuestionIndex];
    
    // FINAL FIX 2: Am mutat calculul `resultMessage` ÎN INTERIORUL blocului de randare unde `isFinished` este garantat `true`.
    // Acest lucru elimină eroarea "'resultMessage' is possibly 'null'".

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-3xl mx-auto">
                    <Button asChild variant="outline" className="mb-8 group">
                        <Link href={`/materii/${subjectSlug}`}>
                            <ChevronLeft className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" /> Înapoi la materie
                        </Link>
                    </Button>

                    <AnimatePresence mode="wait">
                        {!isFinished ? (
                            <motion.div
                                key={activeQuestionIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-lora">{quiz.title}</CardTitle>
                                        <div className="flex items-center gap-4 pt-2">
                                            <span className="text-sm text-muted-foreground">Întrebarea {activeQuestionIndex + 1} / {quiz.questions.length}</span>
                                            <Progress value={progress} className="w-full" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xl font-semibold mb-6 min-h-[6rem] flex items-center">{currentQuestion.questionText}</p>
                                        <div className="space-y-3">
                                            {currentQuestion.options.map((option, index) => (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    size="lg"
                                                    className={cn("w-full justify-start h-auto py-3 text-left transition-all duration-200", selectedAnswerForCurrentQuestion === index ? "bg-accent border-primary ring-2 ring-primary/50" : "hover:bg-accent/50")}
                                                    onClick={() => handleAnswerSelect(index)}
                                                    aria-pressed={selectedAnswerForCurrentQuestion === index}
                                                >
                                                    <span className="mr-4 h-6 w-6 rounded-full border bg-background flex items-center justify-center flex-shrink-0 font-mono font-bold">{String.fromCharCode(65 + index)}</span>
                                                    {option}
                                                </Button>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button variant="ghost" onClick={goToPreviousQuestion} disabled={activeQuestionIndex === 0}>Înapoi</Button>
                                        {activeQuestionIndex < quiz.questions.length - 1 ? (
                                            <Button onClick={goToNextQuestion} disabled={selectedAnswerForCurrentQuestion === null}>Următoarea</Button>
                                        ) : (
                                            <Button onClick={handleSubmitQuiz} disabled={selectedAnswerForCurrentQuestion === null}>Finalizează Testul</Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div key="results-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                {(() => {
                                    const finalResultMessage = getResultMessage(score);
                                    return (
                                        <Card className="text-center">
                                            <CardHeader>
                                                {finalResultMessage.icon}
                                                <CardTitle className="text-3xl font-lora mt-4">{finalResultMessage.title}</CardTitle>
                                                <p className="text-muted-foreground">{finalResultMessage.message}</p>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-5xl font-bold">{score} <span className="text-2xl text-muted-foreground">/ {quiz.questions.length}</span></p>
                                                <p className="text-lg mt-2">răspunsuri corecte</p>
                                                <div className="text-left mt-10 space-y-8">
                                                    <h3 className="text-xl font-semibold border-b pb-2">Recapitulare detaliată:</h3>
                                                    {quiz.questions.map((q, index) => {
                                                        const userAnswerIndex = selectedAnswers[index];
                                                        const isCorrect = userAnswerIndex === q.correctAnswerIndex;
                                                        return (
                                                            <div key={q.id}>
                                                                <p className="font-semibold text-lg">{index + 1}. {q.questionText}</p>
                                                                <div className="mt-4 space-y-2">
                                                                    {q.options.map((option, optionIndex) => {
                                                                        const isCorrectAnswer = q.correctAnswerIndex === optionIndex;
                                                                        const isUserAnswer = userAnswerIndex === optionIndex;
                                                                        return (
                                                                            <div key={optionIndex} className={cn("flex items-center gap-3 p-3 rounded-md border text-sm", isCorrectAnswer ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700" : isUserAnswer ? "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700" : "bg-card")}>
                                                                                {isCorrectAnswer ? <Check className="h-5 w-5 text-green-600 flex-shrink-0" /> : isUserAnswer ? <X className="h-5 w-5 text-red-500 flex-shrink-0" /> : <div className="h-5 w-5 flex-shrink-0" />}
                                                                                <span className={cn(isUserAnswer || isCorrectAnswer ? "font-bold" : "font-normal")}>{option}</span>
                                                                                {isUserAnswer && !isCorrectAnswer && <Badge variant="destructive" className="ml-auto">Răspunsul tău</Badge>}
                                                                                {isCorrectAnswer && <Badge variant="secondary" className="ml-auto bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100">Răspuns Corect</Badge>}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                {!isCorrect && userAnswerIndex !== null && (
                                                                    <Alert className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                                                        <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                        <AlertTitle>Explicație</AlertTitle>
                                                                        <AlertDescription>{q.explanation}</AlertDescription>
                                                                    </Alert>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="justify-center pt-6">
                                                <Button size="lg" onClick={handleRetryQuiz}>
                                                    <Repeat className="mr-2 h-4 w-4" /> Încearcă din nou
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    );
                                })()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}