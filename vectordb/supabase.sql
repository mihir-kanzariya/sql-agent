--  RUN 1st
-- create extension vector;

CREATE TYPE training_data_enum AS ENUM ('RELATIONS', 'SCHEMA', 'SQL');


-- RUN 2nd
create table chatgpt (
  id bigserial primary key,
  question text,
  content text,
  content_length bigint,
  content_tokens bigint,
  training_data_type training_data_enum,
  model_id bigint,
  embedding vector(1536),
  user_id bigint,
  file_id bigint NULL
);

-- RUN 2nd
CREATE OR REPLACE FUNCTION chatgpt_search_api (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int,
  modelId bigint,
  userId bigint,
  trainingDataType training_data_enum
)
RETURNS TABLE (
  id bigint,
  question text,
  content text,
  training_data_type training_data_enum,
  content_length bigint,
  content_tokens bigint,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    chatgpt.id,
    chatgpt.question,
    chatgpt.content,
    chatgpt.training_data_type,
    chatgpt.content_length,
    chatgpt.content_tokens,
    1 - (chatgpt.embedding <=> query_embedding) AS similarity
  FROM chatgpt
  WHERE 1 - (chatgpt.embedding <=> query_embedding) > similarity_threshold
    AND chatgpt.model_id = modelId
    AND chatgpt.user_id = userId
    AND chatgpt.training_data_type = trainingDataType
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;


-- RUN 2nd
CREATE OR REPLACE FUNCTION chatgpt_search_ui (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int,
  modelId bigint,
  userId bigint,
  fileId bigint,
  trainingDataType training_data_enum
)
RETURNS TABLE (
  id bigint,
  question text,
  content text,
  training_data_type training_data_enum,
  content_length bigint,
  content_tokens bigint,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    chatgpt.id,
    chatgpt.question,
    chatgpt.content,
    chatgpt.training_data_type,
    chatgpt.content_length,
    chatgpt.content_tokens,
    1 - (chatgpt.embedding <=> query_embedding) AS similarity
  FROM chatgpt
  WHERE 1 - (chatgpt.embedding <=> query_embedding) > similarity_threshold
    AND chatgpt.model_id = modelId
    AND chatgpt.user_id = userId
    AND chatgpt.file_id = fileId
    AND chatgpt.training_data_type = trainingDataType
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
-- Index for user_id
CREATE INDEX chatgpt_user_id_idx ON chatgpt(user_id);

-- Index for model_id
CREATE INDEX chatgpt_model_id_idx ON chatgpt(model_id);

-- Index for file_id
CREATE INDEX chatgpt_file_id_idx ON chatgpt(file_id);

-- Index for model_id
CREATE INDEX chatgpt_training_data_type_idx ON chatgpt(training_data_type);

-- Assuming that vector_cosine_ops is a valid operator class for the vector type:
CREATE INDEX ON chatgpt USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
