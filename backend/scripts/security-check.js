
const axios = require('axios');

const API_URL = 'http://localhost:3001/api';
// Colors for console output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

async function runPenetrationTest() {
    console.log(`${YELLOW}🔒 STARTING SECURITY AUDIT (PENTEST)...${RESET}\n`);

    let studentToken = '';
    let documentId = '34861463-548c-448f-aa9d-210196881773'; // ID d'un document existant (à adapter si besoin)

    // 1. Authentification Student
    try {
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'etudiant@univ-gabon.ga',
            password: 'Password123!',
        });
        studentToken = loginRes.data.accessToken;
        console.log(`${GREEN}✅ Auth Student Success${RESET}`);
    } catch (error) {
        console.log(`${RED}❌ Auth Student Failed: ${error.message}${RESET}`);
        if (error.response) console.log(error.response.data);
        return;
    }

    // 2. TEST IDOR (File Access)
    console.log(`\n${YELLOW}🧪 TEST 1: IDOR on File Access (getPresignedUrl)${RESET}`);
    console.log(`Target Document: ${documentId}`);
    try {
        // Attempt accessing without valid reason (assuming the doc is NOT published or confidential)
        await axios.get(`${API_URL}/upload/presigned/${documentId}`, {
            // No headers or Student headers on Public route
        });
        console.log(`${RED}❌ FAIL: IDOR VULNERABLE! Access granted to protected file.${RESET}`);
    } catch (error) {
        if (error.response?.status === 400 || error.response?.status === 403) {
            console.log(`${GREEN}✅ PASS: Access blocked (Status ${error.response.status}).${RESET}`);
        } else {
            console.log(`${YELLOW}⚠️ WARNING: Unexpected status ${error.response?.status || error.message}${RESET}`);
            if (error.response) console.log(error.response.data);
        }
    }

    // 3. TEST RBAC (Admin Routes)
    console.log(`\n${YELLOW}🧪 TEST 2: RBAC on Admin Routes${RESET}`);
    try {
        await axios.get(`${API_URL}/documents/admin/all`, {
            headers: { Authorization: `Bearer ${studentToken}` },
        });
        console.log(`${RED}❌ FAIL: RBAC BROKEN! Student accessed Admin route.${RESET}`);
    } catch (error) {
        if (error.response?.status === 403) {
            console.log(`${GREEN}✅ PASS: Admin route protected (403 Forbidden).${RESET}`);
        } else {
            console.log(`${RED}❌ FAIL: Unexpected status ${error.response?.status || error.message}${RESET}`);
        }
    }

    // 4. TEST METADATA LEAK (Public API)
    console.log(`\n${YELLOW}🧪 TEST 3: Metadata Leak (findById)${RESET}`);
    try {
        // Assuming documentId is NOT published
        await axios.get(`${API_URL}/documents/${documentId}`);
        console.log(`${RED}❌ FAIL: LEAK! Private document metadata is visible publicly.${RESET}`);
    } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 400) {
            console.log(`${GREEN}✅ PASS: Private document hidden (404 or 400).${RESET}`);
        } else {
            console.log(`${YELLOW}⚠️ WARNING: Unexpected status ${error.response?.status || error.message}${RESET}`);
        }
    }

    console.log(`\n${YELLOW}🏁 AUDIT COMPLETE.${RESET}`);
}

runPenetrationTest();
