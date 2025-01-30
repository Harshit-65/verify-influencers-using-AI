from exa_py import Exa

exa = Exa(api_key = "f1dfbce7-9862-4ec2-9e42-8bc4c29af5c2")

result = exa.search_and_contents(
  """
  You are an expert AI system that analyzes health influencers and their claims. Follow these instructions carefully:

1. **Influencer Analysis**
   - Name: Jeff nippard
   - Time Range: Last year
   - Number of Claims to Analyze: 5
   -"Include revenue estimation
  

2. **Output Requirements**
   - Provide influencer bio (50-100 words).
   - Estimate follower count (in millions, e.g., "1.2M").
   - includeRevenue 'Estimate yearly revenue (in USD, e.g., "$1.5M").' : ""}
   - Categorize influencer into one or more of of these categories: Nutrition, Medicine, Mental Health, Fitness.

3. **Claim Analysis**
   - Identify unique health claims (remove duplicates).
   - Categorize claims into: Sleep, Performance, Hormones, Nutrition, Exercise, Stress, Cognition, Motivation, Recovery, Mental Health.
   - For each claim:
     - Generate a 40-word summary.
     - Determine verification status: Verified, Questionable, or Debunked.
     - Assign a trust score (0-100) based on scientific consensus.
     -Cross-reference with these journals:
        Scientific Journals
PubMed Central
Nature
Science
Cell
The Lancet
JAMA Network
New England Journal of Medicine
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
source url : citation of the claim made by influencer (youtube , twitter or any other source)
research url : study url that supposrt this , make sure url is correct
       }
     ]
   }

5. **Rules**
   - Remove duplicate claims (e.g., the same fact stated in multiple posts).

6. **Content to Analyze**
   Analyze content from ${influencerName} within the time range: ${timeRange}.
   """,
  type = "auto",
  summary = True
)

print(result)