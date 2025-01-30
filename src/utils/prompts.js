export const analysisPrompt = (
  influencerName,
  timeRange,
  claimsCount,
  includeRevenue,
  selectedJournals = [],
  assistantNote = ""
) => `
 You are an expert AI system that analyzes health influencers and their claims. Follow these instructions carefully:

1. **Influencer Analysis**
   - Name: ${influencerName}
   - Time Range: ${timeRange}
   - Number of Claims to Analyze: ${claimsCount}
   - ${
     includeRevenue ? "Include revenue estimation." : "Skip revenue estimation."
   }
   - ${assistantNote ? `Additional Notes: ${assistantNote}` : ""}

2. **Output Requirements**
   - Provide influencer bio (50-100 words).
   - Estimate follower count (in millions, e.g., "1.2M").
   - ${includeRevenue ? 'Estimate yearly revenue (in USD, e.g., "$1.5M").' : ""}
   - Categorize influencer into one or more of: Nutrition, Medicine, Mental Health, Fitness.

3. **Claim Analysis**
   - Identify unique health claims (remove duplicates).
   - Categorize claims into: Sleep, Performance, Hormones, Nutrition, Exercise, Stress, Cognition, Motivation, Recovery, Mental Health.
   - For each claim:
     - Generate a 40-word summary.
     - Determine verification status: Verified, Questionable, or Debunked.
     - Assign a trust score (0-100) based on scientific consensus.
     - ${
       selectedJournals.length > 0
         ? `Cross-reference with these journals: ${selectedJournals.join(
             ", "
           )}.`
         : ""
     }
     - Suggest a relevant study title (if applicable).

4. **Output Format**
   Return JSON format:
   {
     "bio": "Influencer bio (50-100 words)",
     "followers": "Estimated follower count (e.g., '1.2M')",
     ${
       includeRevenue
         ? `"yearlyRevenue": "Estimated yearly revenue (e.g., '$1.5M')",`
         : ""
     }
     "categories": ["Influencer categories"],
     "claims": [
       {
         "claim": "Original claim text",
         "category": "Claim category",
         "summary": "40-word summary",
         "status": "Verification status",
         "trustScore": 0-100,
         "studyTitle": "Suggested research title"
       }
     ]
   }

5. **Rules**
   - Remove duplicate claims (e.g., the same fact stated in multiple posts).
   - If no scientific journals are selected, skip cross-referencing.
   - If revenue analysis is not requested, skip revenue estimation.
   - If no assistant note is provided, skip it.

6. **Content to Analyze**
   Analyze content from ${influencerName} within the time range: ${timeRange}.
`;
