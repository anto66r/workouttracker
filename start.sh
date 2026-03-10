#!/bin/bash
echo "Starting PHP API on http://localhost:8000 ..."
php -S localhost:8000 -t . &
PHP_PID=$!

echo "Starting React dev server on http://localhost:5173 ..."
npm run dev &
VITE_PID=$!

trap "kill $PHP_PID $VITE_PID 2>/dev/null" EXIT INT TERM
wait
