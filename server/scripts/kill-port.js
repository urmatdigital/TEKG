const { execSync } = require('child_process');

const PORT = process.env.PORT || 3001;

try {
  // Для Windows
  if (process.platform === 'win32') {
    const result = execSync(`netstat -ano | findstr :${PORT}`).toString();
    const lines = result.split('\n');
    const line = lines.find(l => l.includes('LISTENING'));
    if (line) {
      const pid = line.split(/\s+/).pop();
      execSync(`taskkill /F /PID ${pid}`);
      console.log(`Process on port ${PORT} was killed`);
    }
  } else {
    // Для Unix-подобных систем
    execSync(`lsof -i :${PORT} | grep LISTEN | awk '{print $2}' | xargs kill -9`);
    console.log(`Process on port ${PORT} was killed`);
  }
} catch (error) {
  console.log(`No process found on port ${PORT}`);
} 