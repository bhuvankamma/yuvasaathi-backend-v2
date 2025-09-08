import React, { useState, useEffect } from 'react';


const App = () => {
  const [view, setView] = useState('dashboard');
  const [jobPostings, setJobPostings] = useState([]);
  const [companyProfile, setCompanyProfile] = useState({
    name: '',
    logoUrl: '',
    description: '',
  });
  const [editingJob, setEditingJob] = useState(null);

  const getPageTitle = () => {
    switch (view) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'postJob':
        return editingJob ? 'Edit Job Posting' : 'Post a New Job';
      case 'viewJobs':
        return 'Manage Job Postings';
      case 'profile':
        return 'Company Profile';
      default:
        return 'Admin Dashboard';
    }
  };

  return (
    <div className="app-container">
     
      <style>
        {`
          .app-container {
            display: flex;
            min-height: 100vh;
            background-color: #f0f2f5;
            font-family: 'Inter', sans-serif;
            color: #1a202c;
          }

          .sidebar {
            display: none;
            flex-shrink: 0;
            width: 256px;
            padding: 2rem 1.5rem;
            background-color: #fff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .sidebar h1 {
            font-size: 1.5rem;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 2.5rem;
          }

          .nav-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .nav-button {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            width: 100%;
            padding: 0.75rem;
            border-radius: 0.75rem;
            transition: all 0.2s ease-in-out;
            border: none;
            cursor: pointer;
            outline: none;
            background-color: transparent;
            color: #4b5563;
          }

          .nav-button.active {
            background-color: #3b82f6;
            color: #fff;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
          }

          .nav-button:hover:not(.active) {
            background-color: #f3f4f6;
          }

          .main-content {
            flex-grow: 1;
            padding: 2rem;
            overflow-y: auto;
          }

          .mobile-menu-wrapper {
            margin-bottom: 1.5rem;
          }

          .mobile-menu {
            display: block;
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            outline: none;
          }

          .page-title {
            font-size: 1.875rem;
            font-weight: 800; /* extabold */
            color: #1f2937;
            margin-bottom: 2rem;
          }

          .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .dashboard-card {
            background-color: #fff;
            padding: 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
            border-left: 4px solid;
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }
          
          .card-title {
            font-size: 1.125rem;
            font-weight: 600; /* semibold */
            color: #374151;
          }

          .card-number {
            font-size: 1.875rem;
            font-weight: bold;
          }
          
          .job-post-form, .company-profile-form, .job-list-card {
            background-color: #fff;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.25rem;
          }

          .form-input, .form-textarea, .form-select {
            display: block;
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            outline: none;
            transition: all 0.15s ease-in-out;
          }

          .form-input:focus, .form-textarea:focus, .form-select:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
          }
          
          .salary-inputs {
            display: flex;
            gap: 1rem;
            flex-direction: column;
          }

          .form-button {
            width: 100%;
            background-color: #3b82f6;
            color: #fff;
            font-weight: bold;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
            border: none;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
          }

          .form-button:hover {
            background-color: #2563eb;
          }

          .job-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .job-item {
            display: flex;
            flex-direction: column;
            background-color: #fff;
            padding: 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
            align-items: flex-start;
          }

          .job-details {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            flex: 1;
            margin-bottom: 1rem;
          }

          .job-title {
            font-size: 1.25rem;
            font-weight: bold;
            color: #1f2937;
          }

          .job-meta {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .job-tags {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.5rem;
          }
          
          .tag {
            font-size: 0.75rem;
            font-weight: 600; /* semibold */
            padding: 0.25rem 0.625rem;
            border-radius: 9999px;
          }

          .tag.type { background-color: #e0e7ff; color: #312e81; }
          .tag.salary { background-color: #d1fae5; color: #065f46; }
          .tag.skill { background-color: #e5e7eb; color: #1f2937; }

          .job-actions {
            display: flex;
            gap: 0.5rem;
          }

          .edit-button {
            background-color: #f97316;
            color: #fff;
            font-weight: 600;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2);
            border: none;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
          }
          
          .delete-button {
            background-color: #ef4444;
            color: #fff;
            font-weight: 600;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
            border: none;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
          }

          /* Tablet and Desktop Styles */
          @media (min-width: 768px) {
            .app-container {
              flex-direction: row;
            }
            .sidebar {
              display: block;
            }
            .mobile-menu-wrapper {
              display: none;
            }
            .dashboard-grid {
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            }
            .salary-inputs {
              flex-direction: row;
            }
          }
        `}
      </style>

  
      <nav className="sidebar">
        <h1>Hiring Hub</h1>
        <ul className="nav-list">
          <li>
            <button
              onClick={() => { setView('dashboard'); setEditingJob(null); }}
              className={`nav-button ${view === 'dashboard' ? 'active' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', fill: 'currentColor' }} viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM6 9a2 2 0 114 0 2 2 0 01-4 0zM14 11a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => { setView('postJob'); setEditingJob(null); }}
              className={`nav-button ${view === 'postJob' ? 'active' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', fill: 'currentColor' }} viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
              </svg>
              <span>Post New Job</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => { setView('viewJobs'); setEditingJob(null); }}
              className={`nav-button ${view === 'viewJobs' ? 'active' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', fill: 'currentColor' }} viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span>Manage Jobs</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => { setView('profile'); setEditingJob(null); }}
              className={`nav-button ${view === 'profile' ? 'active' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', fill: 'currentColor' }} viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0010 16a5.979 5.979 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              <span>My Profile</span>
            </button>
          </li>
        </ul>
      </nav>

      <main className="main-content">
      
        <div className="mobile-menu-wrapper">
          <select
            value={view}
            onChange={(e) => {
              setView(e.target.value);
              setEditingJob(null);
            }}
            className="mobile-menu"
          >
            <option value="dashboard">Dashboard</option>
            <option value="postJob">Post New Job</option>
            <option value="viewJobs">Manage Jobs</option>
            <option value="profile">My Profile</option>
          </select>
        </div>
        
        <h2 className="page-title">{getPageTitle()}</h2>
        
      
        <div>
          {view === 'dashboard' && <Dashboard jobCount={jobPostings.length} />}
          {view === 'postJob' && (
            <JobPostForm
              onAddJob={(newJob) => {
                setJobPostings([...jobPostings, newJob]);
                setView('viewJobs');
              }}
              onUpdateJob={(updatedJob) => {
                setJobPostings(jobPostings.map(job => (job.id === updatedJob.id ? updatedJob : job)));
                setEditingJob(null);
                setView('viewJobs');
              }}
              editingJob={editingJob}
              companyProfile={companyProfile}
            />
          )}
          {view === 'viewJobs' && (
            <JobList
              jobs={jobPostings}
              onEdit={(job) => {
                setEditingJob(job);
                setView('postJob');
              }}
              onDelete={(jobId) => setJobPostings(jobPostings.filter(job => job.id !== jobId))}
            />
          )}
          {view === 'profile' && (
            <CompanyProfileForm
              profile={companyProfile}
              onSave={setCompanyProfile}
            />
          )}
        </div>
      </main>
    </div>
  );
};


const Dashboard = ({ jobCount }) => {
  return (
    <div className="dashboard-grid">
      <div className="dashboard-card" style={{ borderColor: '#3b82f6' }}>
        <div className="card-header">
          <h3 className="card-title">Total Postings</h3>
          <span className="card-number" style={{ color: '#3b82f6' }}>{jobCount}</span>
        </div>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Live and active job vacancies.</p>
      </div>
      <div className="dashboard-card" style={{ borderColor: '#22c55e' }}>
        <div className="card-header">
          <h3 className="card-title">Applications</h3>
          <span className="card-number" style={{ color: '#22c55e' }}>0</span>
        </div>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total applications received.</p>
      </div>
      <div className="dashboard-card" style={{ borderColor: '#f97316' }}>
        <div className="card-header">
          <h3 className="card-title">Views</h3>
          <span className="card-number" style={{ color: '#f97316' }}>0</span>
        </div>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total views on your listings.</p>
      </div>
    </div>
  );
};


const JobPostForm = ({ onAddJob, onUpdateJob, editingJob, companyProfile }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: companyProfile.name || '',
    location: '',
    description: '',
    type: 'Full-time',
    salaryMin: '',
    salaryMax: '',
    skills: '',
    contact: ''
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      company: companyProfile.name || '',
    }));
  }, [companyProfile.name]);

  useEffect(() => {
    if (editingJob) {
      setFormData({
        title: editingJob.title || '',
        company: editingJob.company || companyProfile.name || '',
        location: editingJob.location || '',
        description: editingJob.description || '',
        type: editingJob.type || 'Full-time',
        salaryMin: editingJob.salaryMin || '',
        salaryMax: editingJob.salaryMax || '',
        skills: editingJob.skills ? editingJob.skills.join(', ') : '',
        contact: editingJob.contact || ''
      });
    }
  }, [editingJob, companyProfile.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    const jobData = {
      ...formData,
      company: companyProfile.name || formData.company,
      skills: skillsArray,
    };

    if (editingJob) {
      onUpdateJob({
        ...editingJob,
        ...jobData,
      });
    } else {
      onAddJob({
        id: crypto.randomUUID(),
        ...jobData,
        postedDate: new Date().toISOString().split('T')[0],
      });
    }

    setFormData({
      title: '',
      company: companyProfile.name || '',
      location: '',
      description: '',
      type: 'Full-time',
      salaryMin: '',
      salaryMax: '',
      skills: '',
      contact: ''
    });
  };

  return (
    <div className="job-post-form">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>{editingJob ? 'Edit Job Posting' : 'Post a New Job'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Job Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Senior Software Engineer" required className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="e.g., Innovate Solutions" required className="form-input" disabled={!!companyProfile.name} />
          {companyProfile.name && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
              This field is automatically filled from your company profile.
            </p>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Bengaluru, India" required className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Job Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Describe the job responsibilities and what you are looking for..." required className="form-textarea"></textarea>
        </div>
        <div className="form-group">
          <label className="form-label">Job Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className="form-select">
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Salary Range</label>
          <div className="salary-inputs">
            <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} placeholder="Min Salary" required className="form-input" />
            <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} placeholder="Max Salary" required className="form-input" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Required Skills (comma-separated)</label>
          <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g., React, Node.js, JavaScript" className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Contact Email</label>
          <input type="email" name="contact" value={formData.contact} onChange={handleChange} placeholder="e.g., careers@yourcompany.com" required className="form-input" />
        </div>
        <button type="submit" className="form-button">
          {editingJob ? 'Update Job' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};


const JobList = ({ jobs, onEdit, onDelete }) => {
  return (
    <div className="job-list">
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'extrabold', color: '#1f2937' }}>Your Job Postings ({jobs.length})</h2>
      {jobs.length === 0 ? (
        <p style={{ color: '#6b7280', fontStyle: 'italic' }}>You have no active job postings. Click "Post New Job" to get started.</p>
      ) : (
        jobs.map(job => (
          <div key={job.id} className="job-item">
            <div className="job-details">
              <h3 className="job-title">{job.title}</h3>
              <div className="job-meta">
                {job.companyLogo && (
                  <img src={job.companyLogo} alt={`${job.company} logo`} style={{ height: '2rem', width: '2rem', borderRadius: '9999px', objectFit: 'cover'}}/>
                )}
                <p style={{ color: '#4b5563' }}>{job.company} - {job.location}</p>
              </div>
              <div className="job-tags">
                <span className="tag type">{job.type}</span>
                <span className="tag salary">₹{Number(job.salaryMin).toLocaleString('en-IN')} - ₹{Number(job.salaryMax).toLocaleString('en-IN')} LPA</span>
                {job.skills && job.skills.map((skill, index) => (
                  <span key={index} className="tag skill">{skill}</span>
                ))}
              </div>
            </div>
            <div className="job-actions">
              <button onClick={() => onEdit(job)} className="edit-button">Edit</button>
              <button onClick={() => onDelete(job.id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const CompanyProfileForm = ({ profile, onSave }) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    console.log('Company profile saved successfully!');
  };

  return (
    <div className="company-profile-form">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>Edit Company Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Innovate Solutions" required className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Company Logo URL</label>
          <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="e.g., https://yourcompany.com/logo.png" className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Company Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Tell us about your company..." className="form-textarea"></textarea>
        </div>
        <button type="submit" className="form-button">Save Profile</button>
      </form>
    </div>
  );
};


export default App;
