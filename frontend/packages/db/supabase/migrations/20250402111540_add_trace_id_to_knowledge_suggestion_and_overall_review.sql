DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'KnowledgeSuggestion' 
        AND column_name = 'traceId'
    ) THEN
        ALTER TABLE "public"."KnowledgeSuggestion" ADD COLUMN "traceId" text;
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'OverallReview' 
        AND column_name = 'traceId'
    ) THEN
        ALTER TABLE "public"."OverallReview" ADD COLUMN "traceId" text;
    END IF;
END $$;
