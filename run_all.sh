#!/usr/bin/env bash
set -e

# 1. Activate .venv if it exists
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
elif [ -f ".venv/Scripts/activate" ]; then
    # Fallback for Windows Git Bash users
    source .venv/Scripts/activate
else
    echo "Error: .venv not found. Please run Step 1's setup first to create the virtual environment."
    exit 1
fi

# Cleanup function to kill background processes on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    if [ -n "$UVICORN_PID" ]; then
        kill $UVICORN_PID 2>/dev/null || true
    fi
    if [ -n "$VITE_PID" ]; then
        kill $VITE_PID 2>/dev/null || true
    fi
    exit 0
}
trap cleanup SIGINT SIGTERM

echo "Starting backend server..."
# 2. Start the backend as a background process
uvicorn src.api:app --port 8000 &
UVICORN_PID=$!

echo "Waiting for backend to be ready..."
# 3. Wait for the backend to be ready by polling
max_retries=15
retry_count=0
while ! curl -s http://localhost:8000/health > /dev/null; do
    if [ $retry_count -ge $max_retries ]; then
        echo "Error: Backend failed to start within $max_retries seconds."
        cleanup
    fi
    sleep 1
    retry_count=$((retry_count + 1))
done

echo "Backend is ready!"

# 4. Start the frontend as a background process
echo "Starting frontend server..."
cd frontend
npm run dev -- --port 5173 &
VITE_PID=$!
cd ..

# 5. Print URLs and PIDs
echo ""
echo "========================================="
echo "TerraSpectra is running!"
echo "Backend:  http://localhost:8000 (PID: $UVICORN_PID)"
echo "Frontend: http://localhost:5173 (PID: $VITE_PID)"
echo "Press Ctrl+C to stop both servers cleanly."
echo "========================================="

# Turn off -e so wait can block until interrupted
set +e
wait
