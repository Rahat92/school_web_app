'use client'
import { createContext, useContext, useState } from "react";

// Define the shape of your StudentContext here
export interface StudentContextType {
    // Example properties, update as needed
    studentId: string;
    name: string;
    // Add more fields as required
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export default StudentContext;

// context Provider
// You can create a provider component to wrap your application and provide the context
export const StudentProvider = ({ children }: { children: React.ReactNode }) => {
    const [studentId, setStudentId] = useState<string>("");
    const [name, setName] = useState<string>("");


    return (
        <StudentContext.Provider value={{ studentId, name }}>
            {children}
        </StudentContext.Provider>
    );
}

// usecontext hook
export const useStudentContext = () => {
    const context = useContext(StudentContext);
    if (!context) {
        throw new Error("useStudentContext must be used within a StudentProvider");
    }
    return context;
}
