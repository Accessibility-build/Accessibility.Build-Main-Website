-- Add new tool types to the tool_type enum
-- Required for PDF Accessibility Checker and Overlay Detector tools
ALTER TYPE "tool_type" ADD VALUE IF NOT EXISTS 'pdf_accessibility_checker';
ALTER TYPE "tool_type" ADD VALUE IF NOT EXISTS 'overlay_detector';
