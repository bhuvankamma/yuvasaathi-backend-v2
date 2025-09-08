import React, { useState } from 'react'; 
import axios from 'axios'; 

// For demo purposes, we will not use the userId prop
const ResumeBuilder = () => { 
    const [formData, setFormData] = useState({ 
        firstName: '', 
        middleName: '', 
        surname: '', 
        email: '', 
        mobile: '', 
        education: '', 
        location: '', 
        history: '', 
        certifications: '', 
    }); 
    const [resumeFile, setResumeFile] = useState(null); 
    const [message, setMessage] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    const [generatedResumePath, setGeneratedResumePath] = useState(null); 

    const handleInputChange = (e) => { 
        const { name, value } = e.target; 
        setFormData(prevData => ({ 
            ...prevData, 
            [name]: value 
        })); 
    }; 

    const handleFileChange = (e) => { 
        setResumeFile(e.target.files[0]); 
    }; 

    const handleBuildResume = async (e) => { 
        e.preventDefault(); 
        
        setIsLoading(true); 
        setMessage('Building your resume...'); 
        setGeneratedResumePath(null); // Clear previous path 

        // For demo purposes, use a fixed dummy user ID, like 1.
        const demoUserId = 1;

        try { 
            // First, send the form data to the new resume generation endpoint 
            const res = await axios.post( 
                `http://127.0.0.1:5000/api/generate_resume/${demoUserId}`, 
                formData 
            ); 
            setMessage(res.data.message); 
            setGeneratedResumePath(res.data.path); 

            // You can optionally still upload an existing resume here, 
            // but the primary action is now generating a new one. 
            if (resumeFile) { 
                // ... (your existing upload logic here) 
            } 
        } catch (err) { 
            setMessage("❌ Failed to build resume: " + (err.response?.data?.error || "Server error")); 
        } finally { 
            setIsLoading(false); 
        } 
    }; 
    
    const handleDownload = async () => { 
        // For demo purposes, use a fixed dummy user ID, like 1.
        const demoUserId = 1;

        try { 
            // Use Axios to fetch the file blob 
            const response = await axios.get( 
                `http://127.0.0.1:5000/api/download_resume/${demoUserId}`, 
                { 
                    responseType: 'blob' // Important for handling binary data 
                } 
            ); 

            // Create a temporary URL for the blob 
            const fileURL = window.URL.createObjectURL(new Blob([response.data])); 
            const link = document.createElement('a'); 
            link.href = fileURL; 
            link.setAttribute('download', 'My_Resume.pdf'); 
            document.body.appendChild(link); 
            link.click(); 
            document.body.removeChild(link); 
            window.URL.revokeObjectURL(fileURL); // Clean up the temporary URL 
            
        } catch (err) { 
            setMessage("❌ Failed to download resume: " + (err.response?.data?.error || "Server error")); 
        } 
    }; 
    
    const inputClasses = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"; 
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1"; 

    return ( 
        <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center"> 
            {/* UPDATED: Changed max-w-3xl to max-w-xl and p-8 to p-4 */}
            <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-xl"> 
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">Resume Builder</h1> 
                <p className="text-center text-gray-600 mb-8">Enter your professional details to create your resume.</p> 

                <form onSubmit={handleBuildResume} className="space-y-6"> 
                    {/* Personal Details Section */} 
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
                        <div> 
                            <label htmlFor="firstName" className={labelClasses}>First Name</label> 
                            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className={inputClasses} required /> 
                        </div> 
                        <div> 
                            <label htmlFor="middleName" className={labelClasses}>Middle Name</label> 
                            <input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleInputChange} className={inputClasses} /> 
                        </div> 
                        <div> 
                            <label htmlFor="surname" className={labelClasses}>Surname</label> 
                            <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleInputChange} className={inputClasses} required /> 
                        </div> 
                        <div> 
                            <label htmlFor="email" className={labelClasses}>Email</label> 
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClasses} required /> 
                        </div> 
                        <div> 
                            <label htmlFor="mobile" className={labelClasses}>Mobile Number</label> 
                            <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} className={inputClasses} required /> 
                        </div> 
                        <div> 
                            <label htmlFor="location" className={labelClasses}>Current Location</label> 
                            <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className={inputClasses} required /> 
                        </div> 
                    </div> 

                    {/* Professional Details Section */} 
                    <div className="space-y-6 mt-8"> 
                        <div> 
                            <label htmlFor="education" className={labelClasses}>Education Qualification</label> 
                            <input type="text" id="education" name="education" value={formData.education} onChange={handleInputChange} className={inputClasses} required /> 
                        </div> 
                        <div> 
                            <label htmlFor="history" className={labelClasses}>Employment History & Appraisals</label> 
                            <textarea id="history" name="history" value={formData.history} onChange={handleInputChange} className={`${inputClasses} h-24`} rows="4"></textarea> 
                        </div> 
                        <div> 
                            <label htmlFor="certifications" className={labelClasses}>Certifications (comma separated)</label> 
                            <textarea id="certifications" name="certifications" value={formData.certifications} onChange={handleInputChange} className={`${inputClasses} h-24`} rows="4"></textarea> 
                        </div> 
                    </div> 

                    {/* File Upload Section */} 
                    <div className="mt-8 border-t pt-6"> 
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Existing Resume (Optional)</h2> 
                        <p className="text-gray-500 mb-4 text-sm">Supported formats: .pdf, .docx</p> 
                        <input 
                            type="file" 
                            accept=".pdf,.docx" 
                            onChange={handleFileChange} 
                            className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                        /> 
                    </div> 
                    
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className={`w-full px-6 py-3 rounded-full text-white font-bold transition-colors ${ 
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700' 
                        }`} 
                    > 
                        {isLoading ? 'Processing...' : 'Build My Resume'} 
                    </button> 
                    
                    {message && <p className={`mt-4 text-center ${message.startsWith('❌') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>} 

                    {/* New Download Button */} 
                    {generatedResumePath && ( 
                        <div className="mt-6 text-center"> 
                            <button 
                                onClick={handleDownload} 
                                className="w-full px-6 py-3 rounded-full text-blue-600 font-bold border-2 border-blue-600 hover:bg-blue-50 transition-colors" 
                            > 
                                Download My Resume 
                            </button> 
                        </div> 
                    )} 
                </form> 
            </div> 
        </div> 
    ); 
}; 

export default ResumeBuilder;