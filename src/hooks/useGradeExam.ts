// import { useState } from 'react';
// import axios from 'axios';
// import { StudentExamType } from '@/models/StudentExam';

// interface UseGradeExamResult {
//     gradeExam: (studentExamImage: string, teacherExamImage: string,studentEmail:string) => Promise<void>;
//     loading: boolean;
//     error: string | null;
//     grade: string | null;
//     evaluation: string | null; 
//     studentExam:StudentExamType
// }

// const useGradeExam = (): UseGradeExamResult => {
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
//     const [grade, setGrade] = useState<string | null>(null);
//     const [evaluation, setEvaluation] = useState<string | null>(null); // הוספת state להערכה
//     const [studentExam, setStudentExam] = useState<StudentExamType | null>(null); // הוספת state לבחינה של התלמיד

//     const gradeExam = async (studentExamImage: string, teacherExamImage: string, studentEmail: string): Promise<void> => {
//         setLoading(true);
//         setError(null); 
//         console.log("1"+studentExamImage) ;
//         console.log("2"+teacherExamImage) ;
        
//         try {
//             const response = await axios.post('http://localhost:5000/grade', {
//                 student_exam_name: studentExamImage,
//                 teacher_exam_name: teacherExamImage,
//                 student_email: studentEmail, 
//             });
            
            
          
//             setGrade(response.data.grade); 
//             setEvaluation(response.data.evaluation); 
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 setError(error.message);
//                 console.error('Error during submission:', error.message);
//             } else {
//                 setError('Unexpected error occurred');
//                 console.error('Unexpected error:', error);
//             }
//         } finally {
//             setLoading(false);
//         }
//     return { gradeExam, loading, error, grade, evaluation, studentExam };
//     return { gradeExam, loading, error, grade, evaluation };
// };

// export default useGradeExam;
