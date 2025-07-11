/* eslint-disable no-console, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
// This is a utility script that requires console output for user feedback
const fs = require('fs');
const path = require('path');

function findJSFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            findJSFiles(filePath, fileList);
        } else if (file.endsWith('.js')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

function removeAiToolboxReferences() {
    console.log('🔍 Finding all JavaScript files...');
    const jsFiles = findJSFiles('./source');
    
    console.log(`📁 Found ${jsFiles.length} JavaScript files`);
    
    let totalReplacements = 0;
    let filesModified = 0;
    
    jsFiles.forEach(filePath => {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Count occurrences before replacement
            const beforeCount = (content.match(/ai-toolbox/g) || []).length;
            
            if (beforeCount > 0) {
                // Replace all instances of "ai-toolbox" with "example-removed"
                const updatedContent = content.replace(/ai-toolbox/g, 'example-removed');
                
                // Write the updated content back to the file
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                
                const afterCount = (updatedContent.match(/ai-toolbox/g) || []).length;
                const replacements = beforeCount - afterCount;
                
                if (replacements > 0) {
                    console.log(`✅ ${filePath}: ${replacements} replacements`);
                    totalReplacements += replacements;
                    filesModified++;
                }
            }
        } catch (error) {
            console.error(`❌ Error processing ${filePath}:`, error.message);
        }
    });
    
    console.log('\n📊 Summary:');
    console.log(`Files processed: ${jsFiles.length}`);
    console.log(`Files modified: ${filesModified}`);
    console.log(`Total replacements: ${totalReplacements}`);
    
    // Verify the cleanup
    console.log('\n🔍 Verifying cleanup...');
    let remainingRefs = 0;
    jsFiles.forEach(filePath => {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const matches = (content.match(/ai-toolbox/g) || []).length;
            remainingRefs += matches;
        } catch (error) {
            console.error(`❌ Error verifying ${filePath}:`, error.message);
        }
    });
    
    console.log(`Remaining "ai-toolbox" references: ${remainingRefs}`);
    
    if (remainingRefs === 0) {
        console.log('✅ All "ai-toolbox" references successfully removed!');
    } else {
        console.log('⚠️  Some "ai-toolbox" references may still remain');
    }
}

// Run the script
removeAiToolboxReferences();