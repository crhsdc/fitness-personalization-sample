import json
import boto3

def lambda_handler(event, context):
    # Initialize Bedrock client
    bedrock = boto3.client('bedrock-runtime')
    
    # Get the input text from the event
    body = event.get("body")
    parsed_body = {}
    if body:
        # Parse the JSON body if needed
        parsed_body = json.loads(body)
        input_text = parsed_body.get("prompt")
    
    # Prepare the request body
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1000,
        "messages": [
            {
                "role": "user",
                "content": input_text
            }
        ],
        "temperature": 0.7
    }
    
    try:
        # Call Bedrock with Claude model
        response = bedrock.invoke_model(
            modelId='anthropic.claude-3-sonnet-20240229-v1:0',
            body=json.dumps(request_body)
        )
        
        # Parse the response
        response_body = json.loads(response.get('body').read())
        generated_text = response_body['content'][0]['text']
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'generated_text': generated_text
            })
        }

        
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'input':input_text
            })
        }