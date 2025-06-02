
export type ExamType = {
    id: number,
    userId: number |undefined,
    name: string,
    uniqueFileName: string,
    namePrefix: string,
    lang:string
    examType: string,
    folderId: number|null,
    isShared: boolean,
    isStarred: boolean,
    examPath: string,
    updatedAt:Date,
    createdAt:Date,
    status:  'PENDING' | 'COMPLETED' | 'IN_PROGRESS',
    submissions:number,
    averageGrade:number|null,

}

export type ExamFolderType={
    id: number,
    userId: number,
    name: string,
    namePrefix: string,
    lang:string,
    parentFolderId: number|null,
    updatedAt:Date,
    createdAt:Date,
    isShared: boolean,
    isStarred: boolean,
    ofTeacherExams: boolean,
    type:'FOLDER',
}
export type ExamFileType = ExamType & {
    folderId?: number;
    type: 'FILE';
}
