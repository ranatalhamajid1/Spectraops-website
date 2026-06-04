const express = require('express');
const ToolsController = require('./controller');

const router = express.Router();

// Publicly available tool endpoint routers
router.post('/check-email', ToolsController.checkEmailBreach);
router.post('/check-password', ToolsController.checkPassword);
router.post('/scan-url', ToolsController.scanUrl);
router.post('/scan-file', ToolsController.scanFile);
router.post('/check-ip-reputation', ToolsController.checkIPReputation);
router.post('/check-ssl', ToolsController.checkSSL);
router.post('/dns-lookup', ToolsController.dnsLookup);
router.post('/whois-lookup', ToolsController.whoisLookup);
router.post('/scan-ports', ToolsController.scanPorts);
router.post('/analyze-headers', ToolsController.analyzeHeaders);
router.post('/find-subdomains', ToolsController.findSubdomains);
router.post('/decode-jwt', ToolsController.decodeJwt);
router.post('/generate-hash', ToolsController.generateHash);

// New tools endpoints
router.post('/analyze-http-headers', ToolsController.analyzeHttpHeaders);
router.post('/check-blacklist', ToolsController.checkBlacklist);
router.post('/detect-technologies', ToolsController.detectTechnologies);
router.post('/base64-encode', ToolsController.base64Encode);
router.post('/base64-decode', ToolsController.base64Decode);
router.post('/calculate-cvss', ToolsController.calculateCvss);
router.post('/calculate-risk', ToolsController.calculateRisk);
router.post('/validate-sitemap', ToolsController.validateSitemap);
router.post('/test-robots', ToolsController.testRobots);
router.post('/extract-metadata', ToolsController.extractMetadata);
router.post('/analyze-email-headers', ToolsController.analyzeEmailHeaders);

module.exports = router;
