/* =========================================================
   RESUME MATCH AI
   PS ID: ALG-AI-01

   Features:
   - Resume Upload
   - PDF / DOCX / TXT extraction
   - Job Description analysis
   - Skill extraction
   - Education extraction
   - Experience extraction
   - Candidate scoring
   - Ranking
   - Search
   - Filters
   - Explainable matching
   - Claim verification
========================================================= */


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let selectedFiles = [];
let candidates = [];
let currentJob = null;


/* =========================================================
   SKILL DATABASE
========================================================= */

const SKILLS = [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "React",
    "React.js",
    "Node.js",
    "Express",
    "HTML",
    "CSS",
    "Tailwind",
    "SQL",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "NLP",
    "Natural Language Processing",
    "TensorFlow",
    "PyTorch",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "AWS",
    "Azure",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "Git",
    "GitHub",
    "C++",
    "C",
    "C#",
    "PHP",
    "Django",
    "Flask",
    "FastAPI",
    "Spring Boot",
    "REST API",
    "REST APIs",
    "Firebase",
    "Figma",
    "Power BI",
    "Excel",
    "Tableau",
    "Data Analysis",
    "Data Science"
];


/* =========================================================
   EDUCATION DATABASE
========================================================= */

const EDUCATION = [
    "B.Tech",
    "BTech",
    "Bachelor of Technology",

    "B.E",
    "BE",
    "Bachelor of Engineering",

    "BCA",
    "Bachelor of Computer Applications",

    "B.Sc",
    "BSc",
    "Bachelor of Science",

    "M.Tech",
    "MTech",
    "Master of Technology",

    "MCA",
    "Master of Computer Applications",

    "M.Sc",
    "MSc",
    "Master of Science",

    "MBA",
    "Master of Business Administration",

    "PhD",
    "Ph.D"
];


/* =========================================================
   DOM ELEMENTS
========================================================= */

const resumeFiles = document.getElementById("resumeFiles");
const fileList = document.getElementById("fileList");
const analyzeBtn = document.getElementById("analyzeBtn");
const jobDescription = document.getElementById("jobDescription");
const loading = document.getElementById("loading");

const dashboard = document.getElementById("dashboard");

const candidateList = document.getElementById("candidateList");
const searchCandidate = document.getElementById("searchCandidate");
const scoreFilter = document.getElementById("scoreFilter");

const noResults = document.getElementById("noResults");

const candidateModal = document.getElementById("candidateModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");


/* =========================================================
   PDF.JS WORKER
========================================================= */

if (typeof pdfjsLib !== "undefined") {

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

}


/* =========================================================
   FILE UPLOAD
========================================================= */

resumeFiles.addEventListener("change", function (event) {

    const files = Array.from(event.target.files);

    selectedFiles = files;

    displayFiles();

});


/* =========================================================
   DISPLAY FILES
========================================================= */

function displayFiles() {

    fileList.innerHTML = "";

    if (selectedFiles.length === 0) {
        return;
    }

    selectedFiles.forEach((file, index) => {

        const item = document.createElement("div");

        item.className = "file-item";

        item.innerHTML = `
            <span class="file-name">
                📄 ${escapeHTML(file.name)}
            </span>

            <button
                class="remove-file"
                onclick="removeFile(${index})"
            >
                ×
            </button>
        `;

        fileList.appendChild(item);

    });

}


/* =========================================================
   REMOVE FILE
========================================================= */

function removeFile(index) {

    selectedFiles.splice(index, 1);

    displayFiles();

    resumeFiles.value = "";

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   EXTRACT PDF TEXT
========================================================= */

async function extractPDFText(file) {

    if (typeof pdfjsLib === "undefined") {
        throw new Error("PDF.js library could not be loaded.");
    }

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib
        .getDocument({
            data: arrayBuffer
        })
        .promise;

    let fullText = "";

    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        const page = await pdf.getPage(pageNumber);

        const textContent = await page.getTextContent();

        const pageText = textContent.items
            .map(item => item.str)
            .join(" ");

        fullText += pageText + "\n";

    }

    return fullText;

}


/* =========================================================
   EXTRACT DOCX TEXT
========================================================= */

async function extractDOCXText(file) {

    if (typeof mammoth === "undefined") {
        throw new Error("DOCX parser could not be loaded.");
    }

    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.extractRawText({
        arrayBuffer: arrayBuffer
    });

    return result.value || "";

}


/* =========================================================
   EXTRACT FILE TEXT
========================================================= */

async function extractFileText(file) {

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".pdf")) {

        return await extractPDFText(file);

    }

    if (fileName.endsWith(".docx")) {

        return await extractDOCXText(file);

    }

    if (fileName.endsWith(".txt")) {

        return await file.text();

    }

    return "";

}


/* =========================================================
   NORMALIZE TEXT
========================================================= */

function normalizeText(text) {

    return text
        .replace(/\s+/g, " ")
        .trim();

}


/* =========================================================
   EXTRACT SKILLS
========================================================= */

function extractSkills(text) {

    const lowerText = text.toLowerCase();

    const found = [];

    SKILLS.forEach(skill => {

        const skillLower = skill.toLowerCase();

        if (lowerText.includes(skillLower)) {

            if (!found.some(
                existing =>
                    existing.toLowerCase() === skill.toLowerCase()
            )) {

                found.push(skill);

            }

        }

    });

    return found;

}


/* =========================================================
   EXTRACT EXPERIENCE
========================================================= */

function extractExperience(text) {

    const patterns = [

        /(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\s+(?:of\s+)?experience/gi,

        /experience\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)/gi,

        /(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)/gi

    ];


    let maximumExperience = 0;


    patterns.forEach(pattern => {

        const matches = [...text.matchAll(pattern)];

        matches.forEach(match => {

            const value = parseFloat(match[1]);

            if (!isNaN(value)) {

                maximumExperience =
                    Math.max(maximumExperience, value);

            }

        });

    });


    return maximumExperience;

}


/* =========================================================
   EXTRACT EDUCATION
========================================================= */

function extractEducation(text) {

    const lowerText = text.toLowerCase();

    const found = [];

    EDUCATION.forEach(degree => {

        if (lowerText.includes(degree.toLowerCase())) {

            if (!found.some(
                existing =>
                    existing.toLowerCase() === degree.toLowerCase()
            )) {

                found.push(degree);

            }

        }

    });

    return found;

}


/* =========================================================
   EXTRACT EMAIL
========================================================= */

function extractEmail(text) {

    const match = text.match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );

    return match ? match[0] : "Not detected";

}


/* =========================================================
   EXTRACT PHONE
========================================================= */

function extractPhone(text) {

    const match = text.match(
        /(?:\+91[\s-]?)?[6-9]\d{9}/
    );

    return match ? match[0] : "Not detected";

}


/* =========================================================
   EXTRACT NAME
========================================================= */

function getCandidateName(fileName, text) {

    const cleanedFileName = fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[_-]/g, " ")
        .trim();


    /*
        Try to detect name from resume text.
        We only use first few lines because names
        normally appear at the top.
    */

    const lines = text
        .split(/\n/)
        .map(line => line.trim())
        .filter(Boolean)
        .slice(0, 8);


    for (const line of lines) {

        const cleanLine = line
            .replace(/[|•]/g, "")
            .trim();

        if (
            cleanLine.length >= 3 &&
            cleanLine.length <= 40 &&
            /^[A-Za-z]+(?:\s+[A-Za-z]+){1,3}$/.test(cleanLine)
        ) {

            const forbidden = [
                "resume",
                "curriculum vitae",
                "profile",
                "objective",
                "developer",
                "engineer",
                "experience",
                "education"
            ];

            const isForbidden =
                forbidden.some(word =>
                    cleanLine.toLowerCase().includes(word)
                );

            if (!isForbidden) {
                return cleanLine;
            }

        }

    }


    return cleanedFileName || "Candidate";

}


/* =========================================================
   ANALYZE JOB DESCRIPTION
========================================================= */

function analyzeJobDescription(text) {

    return {

        skills: extractSkills(text),

        experience: extractExperience(text),

        education: extractEducation(text)

    };

}


/* =========================================================
   EDUCATION MATCH
========================================================= */

function isEducationMatch(candidateEducation, jobEducation) {

    if (!jobEducation || jobEducation.length === 0) {

        return true;

    }


    if (!candidateEducation ||
        candidateEducation.length === 0) {

        return false;

    }


    return candidateEducation.some(candidateEdu =>

        jobEducation.some(requiredEdu => {

            const candidate = candidateEdu.toLowerCase();
            const required = requiredEdu.toLowerCase();

            return (
                candidate.includes(required) ||
                required.includes(candidate)
            );

        })

    );

}


/* =========================================================
   CALCULATE SCORE
========================================================= */

function calculateCandidateScore(candidate, job) {

    /*
        Weight:
        Skills       = 60%
        Experience   = 25%
        Education    = 15%
    */

    let skillScore = 100;


    /* ---------- SKILL SCORE ---------- */

    if (job.skills.length > 0) {

        const matchedSkills = candidate.skills.filter(skill =>

            job.skills.some(required =>

                required.toLowerCase() ===
                skill.toLowerCase()

            )

        );


        skillScore =
            (matchedSkills.length / job.skills.length) * 100;

    }


    /* ---------- EXPERIENCE SCORE ---------- */

    let experienceScore = 100;


    if (job.experience > 0) {

        if (candidate.experience <= 0) {

            experienceScore = 0;

        } else {

            experienceScore = Math.min(
                (candidate.experience / job.experience) * 100,
                100
            );

        }

    }


    /* ---------- EDUCATION SCORE ---------- */

    let educationScore = 100;


    if (job.education.length > 0) {

        educationScore =
            isEducationMatch(
                candidate.educationArray,
                job.education
            )
                ? 100
                : 0;

    }


    /* ---------- FINAL SCORE ---------- */

    const finalScore =
        skillScore * 0.60 +
        experienceScore * 0.25 +
        educationScore * 0.15;


    return Math.round(finalScore);

}


/* =========================================================
   MATCHED SKILLS
========================================================= */

function getMatchedSkills(candidateSkills, jobSkills) {

    return candidateSkills.filter(skill =>

        jobSkills.some(required =>

            required.toLowerCase() ===
            skill.toLowerCase()

        )

    );

}


/* =========================================================
   MISSING SKILLS
========================================================= */

function getMissingSkills(candidateSkills, jobSkills) {

    return jobSkills.filter(required =>

        !candidateSkills.some(skill =>

            skill.toLowerCase() ===
            required.toLowerCase()

        )

    );

}


/* =========================================================
   CLAIM VERIFICATION
========================================================= */

function verifyClaims(text, candidate, job) {

    const claims = [];

    const lowerText = text.toLowerCase();


    /* ---------------------------------------------
       CLAIM 1: REQUIRED SKILL
    --------------------------------------------- */

    job.skills.forEach(skill => {

        const skillFound =
            lowerText.includes(skill.toLowerCase());


        if (skillFound) {

            claims.push({

                type: "verified",

                title: `${skill} mentioned`,

                message:
                    `The resume contains "${skill}", so this requirement has textual evidence.`

            });

        }

    });


    /* ---------------------------------------------
       CLAIM 2: EXPERIENCE
    --------------------------------------------- */

    if (job.experience > 0) {

        if (candidate.experience >= job.experience) {

            claims.push({

                type: "verified",

                title: "Experience requirement",

                message:
                    `Resume indicates approximately ${candidate.experience} year(s) of experience, meeting the ${job.experience}+ year requirement.`

            });

        } else if (candidate.experience > 0) {

            claims.push({

                type: "warning",

                title: "Experience below requirement",

                message:
                    `Resume indicates approximately ${candidate.experience} year(s), while the job requires ${job.experience}+ year(s).`

            });

        } else {

            claims.push({

                type: "warning",

                title: "Experience not detected",

                message:
                    "The resume does not contain a clear numeric experience claim that could be verified."

            });

        }

    }


    /* ---------------------------------------------
       CLAIM 3: EDUCATION
    --------------------------------------------- */

    if (job.education.length > 0) {

        if (
            isEducationMatch(
                candidate.educationArray,
                job.education
            )
        ) {

            claims.push({

                type: "verified",

                title: "Education requirement",

                message:
                    "The candidate's detected education appears compatible with the job requirement."

            });

        } else {

            claims.push({

                type: "warning",

                title: "Education mismatch",

                message:
                    "The resume does not show an education qualification matching the detected job requirement."

            });

        }

    }


    /* ---------------------------------------------
       CLAIM 4: SKILL WITHOUT EVIDENCE
    --------------------------------------------- */

    const importantSkills = job.skills.slice(0, 10);

    importantSkills.forEach(skill => {

        if (
            !lowerText.includes(skill.toLowerCase())
        ) {

            claims.push({

                type: "warning",

                title: `${skill} not supported`,

                message:
                    `The resume does not contain textual evidence for "${skill}". It should not receive credit for this requirement.`

            });

        }

    });


    /* ---------------------------------------------
       CLAIM 5: CONTRADICTORY EXPERIENCE
    --------------------------------------------- */

    const dateRanges =
        text.match(
            /20\d{2}\s*(?:-|–|to)\s*(20\d{2}|present|current)/gi
        );


    if (dateRanges && dateRanges.length >= 2) {

        const yearsFromRanges =
            calculateYearsFromDateRanges(dateRanges);


        if (
            yearsFromRanges > 0 &&
            candidate.experience > 0 &&
            candidate.experience > yearsFromRanges + 1
        ) {

            claims.push({

                type: "warning",

                title: "Possible experience inconsistency",

                message:
                    `The resume claims approximately ${candidate.experience} years, but the visible employment dates suggest around ${yearsFromRanges} year(s). This should be manually verified.`

            });

        }

    }


    return claims;

}


/* =========================================================
   DATE RANGE CALCULATION
========================================================= */

function calculateYearsFromDateRanges(ranges) {

    let totalMonths = 0;


    ranges.forEach(range => {

        const match = range.match(
            /(20\d{2})\s*(?:-|–|to)\s*(20\d{2}|present|current)/i
        );


        if (!match) return;


        const startYear =
            parseInt(match[1]);


        let endYear;


        if (
            match[2].toLowerCase() === "present" ||
            match[2].toLowerCase() === "current"
        ) {

            endYear =
                new Date().getFullYear();

        } else {

            endYear =
                parseInt(match[2]);

        }


        if (endYear >= startYear) {

            totalMonths +=
                (endYear - startYear) * 12;

        }

    });


    return Math.round(
        (totalMonths / 12) * 10
    ) / 10;

}


/* =========================================================
   CREATE CANDIDATE
========================================================= */

async function createCandidate(file, job) {

    const text =
        normalizeText(
            await extractFileText(file)
        );


    if (!text) {

        throw new Error(
            `Could not extract text from ${file.name}`
        );

    }


    const skills =
        extractSkills(text);


    const experience =
        extractExperience(text);


    const education =
        extractEducation(text);


    const matched =
        getMatchedSkills(
            skills,
            job.skills
        );


    const missing =
        getMissingSkills(
            skills,
            job.skills
        );


    const candidate = {

        name:
            getCandidateName(
                file.name,
                text
            ),

        email:
            extractEmail(text),

        phone:
            extractPhone(text),

        experience,

        education:
            education.length > 0
                ? education.join(", ")
                : "Not detected",

        educationArray:
            education,

        skills,

        matched,

        missing,

        score: 0,

        resume:
            file.name,

        rawText:
            text,

        claims: []

    };


    candidate.score =
        calculateCandidateScore(
            candidate,
            job
        );


    candidate.claims =
        verifyClaims(
            text,
            candidate,
            job
        );


    return candidate;

}


/* =========================================================
   CREATE ALL CANDIDATES
========================================================= */

async function createCandidates(files, jobDescriptionText) {

    const job =
        analyzeJobDescription(
            jobDescriptionText
        );


    currentJob = job;


    const results = [];


    for (const file of files) {

        try {

            const candidate =
                await createCandidate(
                    file,
                    job
                );


            results.push(candidate);

        } catch (error) {

            console.error(
                "Error processing:",
                file.name,
                error
            );


            results.push({

                name:
                    file.name.replace(
                        /\.[^/.]+$/,
                        ""
                    ),

                email:
                    "Could not read",

                phone:
                    "Could not read",

                experience: 0,

                education:
                    "Could not detect",

                educationArray: [],

                skills: [],

                matched: [],

                missing: job.skills,

                score: 0,

                resume: file.name,

                rawText: "",

                claims: [

                    {

                        type: "warning",

                        title: "Resume could not be analyzed",

                        message:
                            error.message

                    }

                ]

            });

        }

    }


    return results.sort(
        (a, b) =>
            b.score - a.score
    );

}


/* =========================================================
   ANALYZE BUTTON
========================================================= */

analyzeBtn.addEventListener(
    "click",
    async function () {

        const jd =
            jobDescription.value.trim();


        /* ---------- VALIDATION ---------- */

        if (!jd) {

            alert(
                "Please enter the Job Description first."
            );

            jobDescription.focus();

            return;

        }


        if (selectedFiles.length === 0) {

            alert(
                "Please upload at least one resume."
            );

            return;

        }


        /* ---------- LOADING ---------- */

        analyzeBtn.disabled = true;

        loading.classList.remove("hidden");


        try {

            candidates =
                await createCandidates(
                    selectedFiles,
                    jd
                );


            updateDashboard();

            renderCandidates(candidates);

            dashboard.classList.remove("hidden");


            /*
                Scroll to results
            */

            dashboard.scrollIntoView({
                behavior: "smooth"
            });


        } catch (error) {

            console.error(error);

            alert(
                "Something went wrong while analyzing resumes."
            );

        } finally {

            analyzeBtn.disabled = false;

            loading.classList.add("hidden");

        }

    }
);


/* =========================================================
   UPDATE DASHBOARD
========================================================= */

function updateDashboard() {

    const total =
        candidates.length;


    const strong =
        candidates.filter(
            candidate =>
                candidate.score >= 80
        ).length;


    const average =
        total > 0
            ? Math.round(
                candidates.reduce(
                    (sum, candidate) =>
                        sum + candidate.score,
                    0
                ) / total
            )
            : 0;


    const top =
        total > 0
            ? candidates[0].score
            : 0;


    document.getElementById(
        "totalCandidates"
    ).textContent = total;


    document.getElementById(
        "strongMatches"
    ).textContent = strong;


    document.getElementById(
        "averageScore"
    ).textContent =
        `${average}%`;


    document.getElementById(
        "topScore"
    ).textContent =
        `${top}%`;


    document.getElementById(
        "resultCount"
    ).textContent =
        total;

}


/* =========================================================
   SCORE CLASS
========================================================= */

function getScoreClass(score) {

    if (score >= 80) {
        return "strong";
    }

    if (score >= 60) {
        return "medium";
    }

    return "weak";

}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(word =>
            word[0].toUpperCase()
        )
        .join("");

}


/* =========================================================
   RENDER CANDIDATES
========================================================= */

function renderCandidates(list) {

    candidateList.innerHTML = "";


    if (list.length === 0) {

        noResults.classList.remove("hidden");

        return;

    }


    noResults.classList.add("hidden");


    list.forEach(
        (candidate, index) => {

            const item =
                document.createElement("div");


            item.className =
                "candidate";


            const skillTags =
                candidate.skills
                    .slice(0, 6)
                    .map(skill =>

                        `<span class="skill-tag">
                            ${escapeHTML(skill)}
                        </span>`

                    )
                    .join("");


            item.innerHTML = `

                <div class="rank">
                    #${index + 1}
                </div>

                <div class="avatar">
                    ${escapeHTML(
                        getInitials(candidate.name)
                    )}
                </div>

                <div class="candidate-info">

                    <h3>
                        ${escapeHTML(candidate.name)}
                    </h3>

                    <p>
                        ${candidate.experience || 0} years
                        •
                        ${escapeHTML(candidate.education)}
                    </p>

                    <div class="skill-tags">

                        ${skillTags}

                    </div>

                </div>

                <div class="score-area">

                    <div class="score ${getScoreClass(candidate.score)}">

                        ${candidate.score}%

                    </div>

                    <div class="score-label">
                        Match Score
                    </div>

                </div>

                <button
                    class="view-btn"
                    onclick="openCandidate(${index})"
                >
                    View Details
                </button>

            `;


            candidateList.appendChild(item);

        }
    );

}


/* =========================================================
   FILTER CANDIDATES
========================================================= */

function filterCandidates() {

    const search =
        searchCandidate.value
            .trim()
            .toLowerCase();


    const minimumScore =
        scoreFilter.value === "all"
            ? 0
            : parseInt(scoreFilter.value);


    const filtered =
        candidates.filter(candidate => {

            const matchesSearch =
                candidate.name
                    .toLowerCase()
                    .includes(search) ||

                candidate.skills.some(skill =>
                    skill.toLowerCase()
                        .includes(search)
                ) ||

                candidate.education
                    .toLowerCase()
                    .includes(search);


            const matchesScore =
                candidate.score >=
                minimumScore;


            return (
                matchesSearch &&
                matchesScore
            );

        });


    renderCandidates(filtered);

}


/* =========================================================
   SEARCH
========================================================= */

searchCandidate.addEventListener(
    "input",
    filterCandidates
);


/* =========================================================
   SCORE FILTER
========================================================= */

scoreFilter.addEventListener(
    "change",
    filterCandidates
);


/* =========================================================
   OPEN CANDIDATE MODAL
========================================================= */

function openCandidate(index) {

    /*
        Important:
        The index here belongs to the currently
        rendered candidate list.

        Find candidate through current filtered list.
    */

    const visibleCandidates =
        getVisibleCandidates();


    const candidate =
        visibleCandidates[index];


    if (!candidate) {
        return;
    }


    const matchedHTML =
        candidate.matched.length > 0

            ? candidate.matched
                .map(skill =>
                    `<span class="match-tag green">
                        ✓ ${escapeHTML(skill)}
                    </span>`
                )
                .join("")

            : `<span class="match-tag red">
                    No matched skills
               </span>`;


    const missingHTML =
        candidate.missing.length > 0

            ? candidate.missing
                .map(skill =>
                    `<span class="match-tag red">
                        ✕ ${escapeHTML(skill)}
                    </span>`
                )
                .join("")

            : `<span class="match-tag green">
                    All required skills matched
               </span>`;


    const claimsHTML =
        candidate.claims.length > 0

            ? candidate.claims
                .slice(0, 15)
                .map(claim => `

                    <div class="claim-item ${claim.type}">

                        <strong>
                            ${claim.type === "verified"
                                ? "✓ "
                                : "⚠ "
                            }

                            ${escapeHTML(
                                claim.title
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                claim.message
                            )}
                        </span>

                    </div>

                `)
                .join("")

            : `

                <div class="claim-item">

                    <strong>
                        No verification information
                    </strong>

                    <span>
                        No additional claims could be evaluated.
                    </span>

                </div>

            `;


    const explanation =
        generateExplanation(
            candidate,
            currentJob
        );


    modalBody.innerHTML = `

        <div class="modal-top">

            <div class="modal-name">

                <div class="avatar">

                    ${escapeHTML(
                        getInitials(
                            candidate.name
                        )
                    )}

                </div>

                <div>

                    <h2>
                        ${escapeHTML(
                            candidate.name
                        )}
                    </h2>

                    <p>
                        ${escapeHTML(
                            candidate.resume
                        )}
                    </p>

                </div>

            </div>


            <div class="modal-score">

                <strong class="${getScoreClass(candidate.score)}">

                    ${candidate.score}%

                </strong>

                <span>
                    Overall Match
                </span>

            </div>

        </div>


        <!-- CANDIDATE INFORMATION -->

        <div class="detail-grid">

            <div class="detail-box">

                <h4>Email</h4>

                <p>
                    ${escapeHTML(
                        candidate.email
                    )}
                </p>

            </div>


            <div class="detail-box">

                <h4>Phone</h4>

                <p>
                    ${escapeHTML(
                        candidate.phone
                    )}
                </p>

            </div>


            <div class="detail-box">

                <h4>Experience</h4>

                <p>
                    ${candidate.experience || 0}
                    year(s)
                </p>

            </div>


            <div class="detail-box">

                <h4>Education</h4>

                <p>
                    ${escapeHTML(
                        candidate.education
                    )}
                </p>

            </div>

        </div>


        <!-- MATCHED SKILLS -->

        <div class="match-section">

            <h3>
                ✓ Matched Skills
            </h3>

            <div class="match-tags">

                ${matchedHTML}

            </div>

        </div>


        <!-- MISSING SKILLS -->

        <div class="match-section">

            <h3>
                ✕ Missing / Unsupported Skills
            </h3>

            <div class="match-tags">

                ${missingHTML}

            </div>

        </div>


        <!-- EXPLANATION -->

        <div class="explanation">

            <h3>
                ✦ AI Match Explanation
            </h3>

            <p>
                ${escapeHTML(
                    explanation
                )}
            </p>

        </div>


        <!-- CLAIM VERIFICATION -->

        <div class="claim-box">

            <h3>
                ⚠ Claim & Consistency Verification
            </h3>

            ${claimsHTML}

        </div>

    `;


    candidateModal.classList.remove(
        "hidden"
    );

}


/* =========================================================
   GET CURRENT VISIBLE CANDIDATES
========================================================= */

function getVisibleCandidates() {

    const search =
        searchCandidate.value
            .trim()
            .toLowerCase();


    const minimumScore =
        scoreFilter.value === "all"
            ? 0
            : parseInt(scoreFilter.value);


    return candidates.filter(candidate => {

        const matchesSearch =
            candidate.name
                .toLowerCase()
                .includes(search) ||

            candidate.skills.some(skill =>
                skill.toLowerCase()
                    .includes(search)
            ) ||

            candidate.education
                .toLowerCase()
                .includes(search);


        const matchesScore =
            candidate.score >=
            minimumScore;


        return (
            matchesSearch &&
            matchesScore
        );

    });

}


/* =========================================================
   GENERATE EXPLANATION
========================================================= */

function generateExplanation(
    candidate,
    job
) {

    const parts = [];


    /* SKILLS */

    if (job.skills.length > 0) {

        const skillPercentage =
            Math.round(
                (
                    candidate.matched.length /
                    job.skills.length
                ) * 100
            );


        if (candidate.matched.length > 0) {

            parts.push(
                `The candidate matches ${candidate.matched.length} out of ${job.skills.length} required skills (${skillPercentage}%).`
            );

        } else {

            parts.push(
                "No required technical skills were detected in the resume."
            );

        }

    }


    /* EXPERIENCE */

    if (job.experience > 0) {

        if (
            candidate.experience >=
            job.experience
        ) {

            parts.push(
                `The candidate has approximately ${candidate.experience} year(s) of experience, meeting the required ${job.experience}+ years.`
            );

        } else {

            parts.push(
                `The candidate has approximately ${candidate.experience} year(s) of experience compared with the required ${job.experience}+ years.`
            );

        }

    }


    /* EDUCATION */

    if (job.education.length > 0) {

        if (
            isEducationMatch(
                candidate.educationArray,
                job.education
            )
        ) {

            parts.push(
                "The detected education qualification is compatible with the job requirement."
            );

        } else {

            parts.push(
                "The detected education qualification does not clearly match the job requirement."
            );

        }

    }


    /* MISSING */

    if (candidate.missing.length > 0) {

        parts.push(
            `The main missing or unsupported requirements are: ${candidate.missing.slice(0, 6).join(", ")}.`
        );

    }


    /* FINAL */

    if (candidate.score >= 80) {

        parts.push(
            "Overall, this candidate is a strong match and should be prioritized for recruiter review."
        );

    } else if (candidate.score >= 60) {

        parts.push(
            "Overall, this candidate is a moderate match and may require additional screening."
        );

    } else {

        parts.push(
            "Overall, this candidate has a relatively low match score and should be reviewed carefully before shortlisting."
        );

    }


    return parts.join(" ");

}


/* =========================================================
   CLOSE MODAL
========================================================= */

closeModal.addEventListener(
    "click",
    function () {

        candidateModal.classList.add(
            "hidden"
        );

    }
);


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

candidateModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "modal-overlay"
            )
        ) {

            candidateModal.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================================
   ESC KEY CLOSE MODAL
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            candidateModal.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================================
   DEMO JOB DESCRIPTION
========================================================= */

/*
    Uncomment this if you want the page to
    automatically contain a demo JD.

    jobDescription.value = `
        We are looking for a Full Stack Developer
        with 2+ years of experience.

        Required skills:
        Python, React, JavaScript, SQL, Git, AWS

        Education:
        B.Tech or MCA
    `;
*/


console.log(
    "ResumeMatch AI loaded successfully."
);