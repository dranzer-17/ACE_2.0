

import open_clip
import torch
from PIL import Image
import os
from collections import defaultdict

# --- Configuration ---
SIMILARITY_THRESHOLD = 0.25 # Threshold on the combined score (can be lower)
# How much to trust image-vs-image vs. image-vs-text. 0.6 means 60% of the score comes from image matching.
IMAGE_TO_IMAGE_WEIGHT = 0.6
IMAGE_TO_TEXT_WEIGHT = 0.4

# --- Model Loading ---
print("Loading MULTI-MODAL OpenCLIP models... (This may take a while on first run)")
device = "cuda" if torch.cuda.is_available() else "cpu"

models = {}
preprocessors = {}
tokenizer = None

# We use two models for a robust ensemble
models['laion'], _, preprocessors['laion'] = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
models['openai'], _, preprocessors['openai'] = open_clip.create_model_and_transforms('ViT-B-32', pretrained='openai')
tokenizer = open_clip.get_tokenizer('ViT-B-32')

for name in models:
    models[name].to(device)
print(f"All models loaded successfully on '{device}'.")


# This will store the final, averaged embeddings for each location
db_embeddings = {
    "image": {name: {} for name in models},
    "text": {name: {} for name in models}
}

def get_image_embedding(image_path, model_name):
    """Generates a normalized embedding for a single image."""
    try:
        preprocessor = preprocessors[model_name]
        image = preprocessor(Image.open(image_path)).unsqueeze(0).to(device)
        with torch.no_grad(), torch.cuda.amp.autocast():
            embedding = models[model_name].encode_image(image)
            embedding /= embedding.norm(dim=-1, keepdim=True)
        return embedding
    except Exception as e:
        return None

def get_text_embedding(text, model_name):
    """Generates a normalized embedding for a text description."""
    with torch.no_grad(), torch.cuda.amp.autocast():
        tokens = tokenizer(text).to(device)
        embedding = models[model_name].encode_text(tokens)
        embedding /= embedding.norm(dim=-1, keepdim=True)
    return embedding

def precompute_db_embeddings(location_data, db_folder_path="database_photos"):
    """
    Pre-computes embeddings for both images and text descriptions for all locations.
    It AVERAGES the embeddings of all images for a single location to create a robust representation.
    """
    print("Pre-computing multi-modal embeddings for all locations...")
    
    for location_key, data in location_data.items():
        # --- 1. Process Text Description ---
        description = data["description"]
        for model_name in models:
            db_embeddings["text"][model_name][location_key] = get_text_embedding(description, model_name)

        # --- 2. Process all associated Images ---
        image_files = data["image_files"]
        # Group embeddings from each model
        temp_image_embeddings = defaultdict(list)
        
        for filename in image_files:
            img_path = os.path.join(db_folder_path, filename)
            if os.path.exists(img_path):
                for model_name in models:
                    embedding = get_image_embedding(img_path, model_name)
                    if embedding is not None:
                        temp_image_embeddings[model_name].append(embedding)
            else:
                print(f"Warning: Image file not found: {img_path}")
        
        # Average the image embeddings for each model to get a single, robust vector
        for model_name in models:
            if temp_image_embeddings[model_name]:
                avg_embedding = torch.mean(torch.cat(temp_image_embeddings[model_name]), dim=0, keepdim=True)
                db_embeddings["image"][model_name][location_key] = avg_embedding
                print(f"  - Cached '{location_key}' ({len(image_files)} images, description) for model '{model_name}'")

    print("Database multi-modal embedding cache is ready.")

def find_best_match(user_photo_path):
    """
    Finds the best match by combining image-to-image and image-to-text similarity scores.
    """
    # Generate embeddings for the user's photo from both models
    user_embeddings = {name: get_image_embedding(user_photo_path, name) for name in models}

    combined_scores = {}
    for location_key in db_embeddings["image"]['laion'].keys(): # Iterate through all known locations
        
        # Get scores from each model and average them
        scores_i2i, scores_i2t = [], []
        for model_name in models:
            user_emb = user_embeddings[model_name]
            ref_img_emb = db_embeddings["image"][model_name].get(location_key)
            ref_txt_emb = db_embeddings["text"][model_name].get(location_key)

            if user_emb is not None:
                if ref_img_emb is not None:
                    scores_i2i.append(torch.nn.functional.cosine_similarity(user_emb, ref_img_emb).item())
                if ref_txt_emb is not None:
                    scores_i2t.append(torch.nn.functional.cosine_similarity(user_emb, ref_txt_emb).item())
        
        avg_i2i_score = sum(scores_i2i) / len(scores_i2i) if scores_i2i else 0
        avg_i2t_score = sum(scores_i2t) / len(scores_i2t) if scores_i2t else 0

        # Calculate the final weighted score
        final_score = (avg_i2i_score * IMAGE_TO_IMAGE_WEIGHT) + (avg_i2t_score * IMAGE_TO_TEXT_WEIGHT)
        combined_scores[location_key] = final_score

    if not combined_scores:
        return None, 0.0

    # Find the best match from the combined scores
    best_match_key = max(combined_scores, key=combined_scores.get)
    best_score = combined_scores[best_match_key]

    print(f"Multi-Modal analysis complete. Best match: '{best_match_key}' with combined score {best_score:.2f}")

    if best_score >= SIMILARITY_THRESHOLD:
        return best_match_key, best_score
    else:
        return None, best_score

# # File: matching_logic.py

# import open_clip
# import torch
# from PIL import Image
# import os

# # --- Configuration ---
# SIMILARITY_THRESHOLD = 0.85  # We need a higher confidence now (85%)

# # --- Model Loading ---
# # This is a slow operation, so we do it once when the module is loaded.
# print("Loading MULTIPLE OpenCLIP models... (This may take a while on first run)")
# device = "cuda" if torch.cuda.is_available() else "cpu"

# models = {}
# preprocessors = {}

# # Model 1: Trained on LAION-2B dataset (very diverse)
# models['laion'], _, preprocessors['laion'] = open_clip.create_model_and_transforms(
#     'ViT-B-32', pretrained='laion2b_s34b_b79k'
# )
# # Model 2: The original model from OpenAI (different training data)
# models['openai'], _, preprocessors['openai'] = open_clip.create_model_and_transforms(
#     'ViT-B-32', pretrained='openai'
# )

# for name in models:
#     models[name].to(device)
# print(f"All models loaded successfully on '{device}'.")

# # This will store embeddings for BOTH models in a nested structure
# db_embeddings = {name: {} for name in models}

# def get_image_embedding(image_path, model_name):
#     """Generates a normalized embedding for an image using a specific model."""
#     try:
#         preprocessor = preprocessors[model_name]
#         image = preprocessor(Image.open(image_path)).unsqueeze(0).to(device)
#         with torch.no_grad(), torch.cuda.amp.autocast():
#             embedding = models[model_name].encode_image(image)
#             embedding /= embedding.norm(dim=-1, keepdim=True) # Normalize
#         return embedding
#     except Exception as e:
#         print(f"Error processing image {image_path} with model {model_name}: {e}")
#         return None

# def precompute_db_embeddings(db_folder_path="database_photos"):
#     """Generates embeddings for all database images using ALL models."""
#     print("Pre-computing embeddings for the reference database...")
#     for filename in os.listdir(db_folder_path):
#         if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
#             img_path = os.path.join(db_folder_path, filename)
#             for model_name in models:
#                 embedding = get_image_embedding(img_path, model_name)
#                 if embedding is not None:
#                     db_embeddings[model_name][filename] = embedding
#     print("Database embedding cache is ready for all models.")

# def find_best_match(user_photo_path):
#     """
#     Finds the best match by getting scores from all models and combining them.
#     """
#     if not db_embeddings['laion']: # Check if at least one model has embeddings
#         raise RuntimeError("Database embeddings have not been pre-computed.")

#     # Get embeddings for the user's photo from all models
#     user_embeddings = {
#         name: get_image_embedding(user_photo_path, name) for name in models
#     }

#     # Calculate combined scores for each reference image
#     combined_scores = {}
#     for filename in db_embeddings['laion'].keys():
#         scores = []
#         for model_name in models:
#             user_emb = user_embeddings[model_name]
#             ref_emb = db_embeddings[model_name].get(filename)
#             if user_emb is not None and ref_emb is not None:
#                 score = torch.nn.functional.cosine_similarity(user_emb, ref_emb).item()
#                 scores.append(score)
        
#         # Combine scores by averaging them
#         if scores:
#             combined_scores[filename] = sum(scores) / len(scores)

#     if not combined_scores:
#         return None, 0.0

#     # Find the best match from the combined scores
#     best_match_filename = max(combined_scores, key=combined_scores.get)
#     best_score = combined_scores[best_match_filename]

#     print(f"Combined score analysis complete. Best match: '{best_match_filename}' with combined score {best_score:.2f}")

#     if best_score >= SIMILARITY_THRESHOLD:
#         return best_match_filename, best_score
#     else:
#         return None, best_score