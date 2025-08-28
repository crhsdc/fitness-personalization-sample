import json
import boto3
import base64
import uuid
import os
from datetime import datetime

def lambda_handler(event, context):
    # Initialize Bedrock and S3 clients
    bedrock = boto3.client('bedrock-runtime')
    s3 = boto3.client('s3')
    
    # Get the S3 bucket name from environment variable
    bucket_name = os.environ['S3_BUCKET_NAME']
    
    # Get the prompt from the event
    prompt = ''
    body = event.get('body')
    if body:
        # Parse the JSON body if needed
        parsed_body = json.loads(body)
        prompt = parsed_body.get('prompt', '')
    
    # Validate prompt is not empty
    if not prompt or prompt.strip() == '':
        return {
            'statusCode': 400,
            'body': json.dumps({
                'error': 'Prompt is required and cannot be empty'
            })
        }

    
    # Prepare the request body for Nova Canvas
    request_body = {
        "taskType": "TEXT_IMAGE",
        "textToImageParams": {
            "text": prompt
        },
        "imageGenerationConfig": {
            "numberOfImages": 1,
            "quality": "standard",
            "cfgScale": 8.0,
            "height": 512,
            "width": 512,
            "seed": 42
        }
    }
    
    try:
        # Call Bedrock with Nova Canvas model
        response = bedrock.invoke_model(
            modelId='amazon.nova-canvas-v1:0',
            body=json.dumps(request_body)
        )
        
        # Parse the response
        response_body = json.loads(response.get('body').read())
        
        # The response includes base64-encoded image
        image_data = response_body['images'][0]
        
        # Decode base64 string to bytes
        image_bytes = base64.b64decode(image_data)
        
        # Generate a unique filename with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        file_id = str(uuid.uuid4())[:8]
        file_name = f"image_{timestamp}_{file_id}.png"
        
        # Upload the image to S3
        s3.put_object(
            Bucket=bucket_name,
            Key=file_name,
            Body=image_bytes,
            ContentType='image/png'
        )
        
        # Generate the S3 URL
        s3_url = f"s3://{bucket_name}/{file_name}"
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'prompt': prompt,
                's3_url': s3_url,
                'file_name': file_name,
                'b64_image': image_data
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }