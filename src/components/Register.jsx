import React, { useState, useEffect, useRef } from 'react';

const languages = {
    en: {
        title: 'Register for Yuva Saathi',
        firstName: 'First Name*',
        middleName: 'Middle Name (optional)',
        surname: 'Surname*',
        email: 'Email Address*',
        mobileNumber: 'Mobile Number (10 digits)*',
        aadhaarNumber: 'Aadhaar Number*',
        panNumber: 'PAN Number*',
        password: 'Password*',
        confirmPassword: 'Confirm Password*',
        passwordRequirements: 'Password must contain an uppercase letter, a lowercase letter, a number, and a special character.',
        passwordsMatch: 'Passwords match',
        passwordsMismatch: 'Passwords do not match!',
        education: 'Educational Qualification*',
        selectQualification: 'Select Qualification',
        location: 'Current Location*',
        selectState: 'Select State',
        selectCity: 'Select City',
        employmentHistory: 'Employment History & Appraisals*',
        certifications: 'Certifications*',
        previouslyRegistered: 'Have you previously registered with the Employment Exchange?*',
        yes: 'Yes',
        no: 'No',
        registrationNumber: 'Registration Number*',
        register: 'Register',
        registering: 'Registering...',
        alreadyAccount: 'Already have an account?',
        loginHere: 'Login here',
        aadhaarFormat: 'Aadhaar must be a 12-digit number.',
        panFormat: 'PAN must be 5 letters, 4 numbers, and 1 letter (e.g., ABCDE1234F).',
        mobileFormat: 'Please enter a valid 10-digit mobile number.',
        successMessage: 'Registration successful! An email verification link has been sent to your email. Please verify your email to log in.',
        errorMessage: 'Registration failed: '
    },
};

const statesAndCities = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh'],
    'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur'],
    'Goa': ['Panaji', 'Vasco da Gama'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara'],
    'Haryana': ['Faridabad', 'Gurugram', 'Panipat'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
    'Manipur': ['Imphal'],
    'Meghalaya': ['Shillong'],
    'Mizoram': ['Aizawl'],
    'Nagaland': ['Kohli', 'Dimapur'],
    'Odisha': ['Bhubaneswar', 'Cuttack'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur'],
    'Sikkim': ['Gangtok'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
    'Telangana': ['Hyderabad', 'Warangal'],
    'Tripura': ['Agartala'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi'],
    'Uttarakhand': ['Dehradun', 'Haridwar'],
    'West Bengal': ['Kolkata', 'Howrah', 'Siliguri'],
    'Andaman and Nicobar Islands': ['Port Blair'],
    'Chandigarh': ['Chandigarh'],
    'Dadra and Nagar Haveli and Daman and Diu': ['Daman'],
    'Delhi': ['New Delhi'],
    'Jammu and Kashmir': ['Srinagar', 'Jammu'],
    'Ladakh': ['Leh'],
    'Lakshadweep': ['Kavaratti'],
    'Puducherry': ['Puducherry']
};

const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' }
];

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        surname: '',
        email: '',
        mobileCountryCode: '+91',
        mobileNumber: '',
        aadhaarNumber: '',
        panNumber: '',
        password: '',
        confirmPassword: '',
        education: '',
        locationState: '',
        locationCity: '',
        employmentHistory: '',
        certifications: '',
        previouslyRegistered: 'no',
        registrationNumber: ''
    });

    const [language, setLanguage] = useState('en');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [passwordError, setPasswordError] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const text = languages[language];
    const formRef = useRef(null);

    const backgroundImages = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvNUJ_KWS0Ztd9ZtU-ht7C0dDIaPsYJNM27g&s',
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // VERCEL LIVE BACKEND URL
    // IMPORTANT: Replaced with the correct Vercel backend URL
    const API_BASE_URL = 'https://yuvasaathi-backend-v2.vercel.app';

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(intervalId);
    }, [backgroundImages.length]);

    useEffect(() => {
        if (formData.password || formData.confirmPassword) {
            setPasswordsMatch(formData.password === formData.confirmPassword);
        } else {
            setPasswordsMatch(true);
        }
    }, [formData.password, formData.confirmPassword]);

    // Update the temporary message display useEffect
    useEffect(() => {
        if (message && message.type === 'success') {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 10000); // 10 seconds
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const isVerified = urlParams.get('verified');
        if (isVerified === 'true') {
            setMessage({ type: 'success', text: 'Email verified successfully! You can now log in.' });
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        }
    }, []);

    // New useEffect to handle 'Enter' key press
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevents default form submission if any
                // Check if all required fields are filled and the form is valid before submitting
                if (formRef.current) {
                    const isFormValid = formRef.current.checkValidity();
                    if (isFormValid) {
                        handleSubmit(e);
                    } else {
                        // Optional: Trigger validation UI if the form isn't valid
                        formRef.current.reportValidity();
                    }
                }
            }
        };

        const formElement = formRef.current;
        if (formElement) {
            formElement.addEventListener('keydown', handleKeyPress);
        }

        return () => {
            if (formElement) {
                formElement.removeEventListener('keydown', handleKeyPress);
            }
        };
    }, [formData, loading]); // Added formData and loading to the dependency array

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
        const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

        if (!isValid && password.length > 0) {
            setPasswordError(text.passwordRequirements);
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        if (name === 'password') {
            validatePassword(value);
        }
    };

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'aadhaarNumber':
                if (value && !/^\d{12}$/.test(value)) {
                    error = text.aadhaarFormat;
                }
                break;
            case 'mobileNumber':
                if (value && !/^\d{10}$/.test(value)) {
                    error = text.mobileFormat;
                }
                break;
            default:
                break;
        }
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage(null);
        setLoading(true);

        const newErrors = {};
        if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
            newErrors.aadhaarNumber = text.aadhaarFormat;
        }
        if (!/^\d{10}$/.test(formData.mobileNumber)) {
            newErrors.mobileNumber = text.mobileFormat;
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = text.passwordsMismatch;
        }
        if (!validatePassword(formData.password)) {
            newErrors.password = text.passwordRequirements;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setLoading(false);
            return;
        }

        const dataToSend = {
            First_Name: formData.firstName,
            Middle_Name: formData.middleName,
            Surname: formData.surname,
            Email: formData.email,
            Mobile_No: formData.mobileNumber,
            Aadhaar_Number: formData.aadhaarNumber,
            PAN_Number: formData.panNumber.toUpperCase(),
            Password: formData.password,
            Confirm_password: formData.confirmPassword,
            Education_Claiification: formData.education,
            Current_location: formData.locationCity,
            Empolyment_history_Appraisals: formData.employmentHistory,
            Certifications: formData.certifications,
            Have_You_previously_with_the_Employemnt_Exchange: formData.previouslyRegistered
        };

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();

            if (response.ok) {
                // Show immediate success message
                setMessage({ type: 'success', text: result.message || text.successMessage });
                setFormData({
                    firstName: '',
                    middleName: '',
                    surname: '',
                    email: '',
                    mobileCountryCode: '+91',
                    mobileNumber: '',
                    aadhaarNumber: '',
                    panNumber: '',
                    password: '',
                    confirmPassword: '',
                    education: '',
                    locationState: '',
                    locationCity: '',
                    employmentHistory: '',
                    certifications: '',
                    previouslyRegistered: 'no',
                    registrationNumber: ''
                });
            } else {
                setMessage({ type: 'error', text: result.error || text.errorMessage + 'An unknown error occurred.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: text.errorMessage + 'Network error. Please check your connection and try again.' });
        } finally {
            setLoading(false);
        }
    };

    const educationOptions = [
        '10th', 'Inter', 'Degree', 'Post-Graduate', 'Diploma'
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
            {backgroundImages.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ backgroundImage: `url(${image})` }}
                ></div>
            ))}
            <div className="absolute inset-0 z-0 bg-black opacity-60"></div>
            
            <div className="bg-white/80 backdrop-blur-lg p-4 md:p-8 rounded-3xl shadow-2xl w-full max-w-4xl relative z-10 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-orange-600 w-full">
                        {text.title}
                    </h2>
                    <select onChange={handleLanguageChange} value={language} className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="en">English</option>
                        
                    </select>
                </div>

                {message && (
                    <div className={`p-3 rounded-lg text-center mb-4 font-semibold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{text.firstName}</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{text.middleName}</label>
                            <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{text.surname}</label>
                            <input type="text" name="surname" value={formData.surname} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                    </div>

                    
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{text.email}</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{text.mobileNumber}</label>
                            <div className="flex rounded-lg shadow-sm overflow-hidden mt-1">
                                <select name="mobileCountryCode" value={formData.mobileCountryCode} onChange={handleChange} className="border-t border-b border-l border-gray-300 rounded-l-lg px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    {countryCodes.map(c => (
                                        <option key={c.code} value={c.code}>{c.code}</option>
                                    ))}
                                </select>
                                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={(e) => { handleChange(e); validateField('mobileNumber', e.target.value); }} onBlur={(e) => validateField('mobileNumber', e.target.value)} required maxLength="10" className="block w-full border border-gray-300 rounded-r-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                            {errors.mobileNumber && <p className="text-xs mt-1 text-red-600 font-semibold">{errors.mobileNumber}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{text.aadhaarNumber}</label>
                            <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={(e) => { handleChange(e); validateField('aadhaarNumber', e.target.value); }} onBlur={(e) => validateField('aadhaarNumber', e.target.value)} required maxLength="12" placeholder="xxxx xxxx xxxx" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            {errors.aadhaarNumber && <p className="text-xs mt-1 text-red-600 font-semibold">{errors.aadhaarNumber}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{text.panNumber}</label>
                            <input type="text" name="panNumber" value={formData.panNumber} onChange={(e) => { handleChange(e); }} onBlur={(e) => handleChange(e)} required maxLength="10" placeholder="ADPWK0074K" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase" />
                        </div>
                    </div>

                    
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{text.password}</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            {passwordError && <p className="text-xs mt-1 text-red-600 font-semibold">{passwordError}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{text.confirmPassword}</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            {formData.password && formData.confirmPassword && (
                                <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                                    {passwordsMatch ? text.passwordsMatch : text.passwordsMismatch}
                                </p>
                            )}
                        </div>
                    </div>

                    
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{text.education}</label>
                            <select name="education" value={formData.education} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                <option value="">{text.selectQualification}</option>
                                {educationOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{text.location}</label>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                <select name="locationState" value={formData.locationState} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <option value="">{text.selectState}</option>
                                    {Object.keys(statesAndCities).map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                                <select name="locationCity" value={formData.locationCity} onChange={handleChange} required className={`mt-1 block w-full border rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 ${!formData.locationState ? 'bg-gray-200 cursor-not-allowed' : 'border-gray-300'}`} disabled={!formData.locationState}>
                                    <option value="">{text.selectCity}</option>
                                    {formData.locationState && statesAndCities[formData.locationState].map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Employment History & Certifications */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{text.employmentHistory}</label>
                        <textarea name="employmentHistory" value={formData.employmentHistory} onChange={handleChange} required rows="3" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{text.certifications}</label>
                        <textarea name="certifications" value={formData.certifications} onChange={handleChange} required rows="2" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
                    </div>

                    {/* Employment Exchange Registration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {text.previouslyRegistered}
                        </label>
                        <div className="mt-2 flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="previouslyRegistered"
                                    value="yes"
                                    checked={formData.previouslyRegistered === 'yes'}
                                    onChange={handleChange}
                                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                                /> {text.yes}
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="previouslyRegistered"
                                    value="no"
                                    checked={formData.previouslyRegistered === 'no'}
                                    onChange={handleChange}
                                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                                /> {text.no}
                            </label>
                        </div>
                    </div>
                    {formData.previouslyRegistered === 'yes' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{text.registrationNumber}</label>
                            <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="text-center mt-6">
                        <button type="submit" disabled={loading} className="w-full md:w-auto px-8 py-3 bg-orange-600 text-white font-extrabold rounded-lg shadow-md hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {loading ? text.registering : text.register}
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-700">
                        {text.alreadyAccount}{' '}
                        <a href="/login" className="text-orange-600 font-semibold hover:underline">
                            {text.loginHere}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;