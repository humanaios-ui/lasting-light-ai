#!/bin/bash

# Add FDS headers to test files
add_fds_to_test() {
  local file="$1"
  if [ ! -f "$file" ]; then return; fi
  # Check if FDS header already exists
  if head -1 "$file" | grep -q "FDS:"; then return; fi
  
  # Add FDS header for test files
  sed -i '1i/* FDS: F3-Test | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */\n' "$file"
}

add_fds_to_src() {
  local file="$1"
  if [ ! -f "$file" ]; then return; fi
  # Check if FDS header already exists
  if head -1 "$file" | grep -q "FDS:"; then return; fi
  
  # Add FDS header for source files
  sed -i '1i/* FDS: F3-Source | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */\n' "$file"
}

add_fds_to_lib() {
  local file="$1"
  if [ ! -f "$file" ]; then return; fi
  # Check if FDS header already exists
  if head -1 "$file" | grep -q "FDS:"; then return; fi
  
  # Add FDS header for lib files
  sed -i '1i/* FDS: F3-Library | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */\n' "$file"
}

# Test files
add_fds_to_test "src/arena/ArenaExport.test.ts"
add_fds_to_test "src/lib/contamination-submission.test.ts"
add_fds_to_test "src/lib/contamination.test.ts"

# Source files
add_fds_to_src "src/api/generateDeltaPages.ts"
add_fds_to_src "src/arena/ArenaExport.ts"
add_fds_to_src "src/api/testDeltaGenerator.ts"
add_fds_to_src "src/components/LazyLoadingFallback.tsx"
add_fds_to_src "src/lib/validation.ts"
add_fds_to_src "src/pages/DeltaPageGeneratorDemo.tsx"

# Lib files
add_fds_to_lib "lib/contamination-review.ts"
add_fds_to_lib "examples/contamination-review-integration.example.ts"

echo "✅ FDS headers added"
