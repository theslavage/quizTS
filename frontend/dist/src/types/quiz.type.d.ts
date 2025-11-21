export type QuizType = {
    id: number;
    name: string;
    question: Array<QuizQuestionType>;
};
export type QuizQuestionType = {
    id: number;
    questions: string;
    answers: Array<QuizAnswerType>;
};
export type QuizAnswerType = {
    id: number;
    answer: string;
};
//# sourceMappingURL=quiz.type.d.ts.map