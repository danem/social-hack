import { supabase } from "@utils/supabaseClient";
import OpenAI from "openai";

const _OPENAI_CLIENT = new OpenAI({apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser:true});

export async function fetchLatestTranscript (){ 
    try {
        const { data, error } = await supabase
            .from('transcriptions')
            .select('text')
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) {
            console.error('Error fetching the latest transcript:', error);
        } else if (data.length > 0) {
            return data[0].text;
        }
    } catch (err) {
        console.error('Error during fetching the latest transcript:', err);
    }
}

export async function embedText (text: string){
    const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'text-embedding-ada-002', // Replace with the appropriate embedding model
            input: text
        })
    });
    const data = await response.json();
    return data.data[0].embedding;
}

export async function queryDocuments (text: string){
    const vector = await embedText(text);
    if (!vector) {
        console.error('Failed to generate embedding');
        return;
    }

    const { data, error } = await supabase.rpc('vector_search', {
        query_vector: vector,
        top_k: 5 // Number of similar documents to retrieve
    });

    if (error) {
        console.error('Error querying Supabase:', error);
    } else {
        return data
    }
}

export async function getActionItems (transcript: string) {
    const prompt = `
    Extract all action items for the tenant from the following transcript and list them in a JSON format with a "task" field for each action item. Action items are things like "get photos", "get communications with landlord", etc. Action items are also things NOT answered in the transcript. Do not include things like name, occupation, duration of lease, etc
    
    Transcript: "${transcript}"
    
    Format the output as a JSON array:
    [
      { "task": "Action item 1" },
      { "task": "Action item 2" },
      ...
    ]
    `;
    const resp = await _OPENAI_CLIENT.chat.completions.create({
        messages: [
            { role: 'system', content: "You are a smart helpful assistant that follows directions exactly. Your responses never include additional content"},
            { role: 'user', content: prompt}
        ],
        model: 'gpt-4'
    });
    const actionItems = JSON.parse(resp.choices[0].message.content.trim());
    return actionItems;
}

export async function translateTranscript (transcript: string)  {

}

export async function testActionItems (){
    const convo = `
    Characters: 
    Attorney Sam = AS
    Tenant Betsy = TB
    Landlord John = LJ

    AS: Hello, I’m Sam from CLS. Pleased to meet you.

    TB: Hello, great to meet you. Thank you for helping me with my case.

    AS: Can you confirm your name, your household size, and your income bracket.

    TB: Betsy Cole, household size of 2, income is $45,000

    AS: I see that you have been experiencing mold in your bathroom for the last 2 months.

    TB: Yes, the mold has been getting worse and it has been 2 months.

    AS: I also see here that your son is starting to have health problems, he’s coughing. 

    TB: That’s true. I have taken my son to the doctor who has confirmed his coughing is due to the mold. I’ve contacted my landlord John three times the first week before he finally responded saying he would have it taken care of but he has not yet. I kept following up with John and it has been frustrating. 

    AS: I’m sorry to hear. But something we can look into is doing a petition hearing in our local East Palo Alto court. 

    TB: I’d love to hear more!

    AS: I’ll open up a case and you’ll be prompted to upload pictures of the mold, any email and text correspondence you have with John, and even your son’s doctor’s note in a secure portal. The more you share the better so I can help put together a more compelling case to the court. 

    TB: Sure, no problem. Do you know if I’d be granted any relief from the court?

    AS: Once you submit all the information in the portal, I’ll be able to do an evaluation comparing your case with historic cases on mold in East Palo Alto. However, I can tell you right now that your landlord has had 8 violations the last 24 months on other properties he oversees, 6 of which were on mold. However, I’ll need to dig in deeper what those mold cases were like and what the outcomes were because outcomes depend on many factors from the mold severity to how much time passed before the problem’s addressed to even who that case’s Hearing Officer is. Once I do my evaluation after your submission, I’ll send you what I find within a few business days and give my recommendation on how to proceed. How does that sound?

    TB: That sounds great! Thank you so much, Sam. 

    AS: Of course. Is there anything else I can do for you?

    TB: No, that’s it. We’ll be in touch in the portal. Thanks again.
    `;
    return await getActionItems(convo);
}