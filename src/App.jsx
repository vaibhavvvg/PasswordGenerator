import { useCallback, useEffect, useState, useRef } from "react";

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%&*_";

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length); // FIXED index bug
      pass += str.charAt(char);
    }

    setPassword(pass);
  }, [length, numberAllowed, charAllowed]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 100);
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [password]);

  // Password strength logic
  const getPasswordStrength = () => {
    let score = 0;
    if (length >= 8) score++;
    if (length >= 16) score++;
    if (numberAllowed) score++;
    if (charAllowed) score++;

    switch (score) {
      case 0:
      case 1:
        return { label: "Weak", color: "text-red-500" };
      case 2:
        return { label: "Moderate", color: "text-yellow-400" };
      case 3:
        return { label: "Strong", color: "text-green-400" };
      case 4:
        return { label: "Very Strong", color: "text-emerald-500" };
      default:
        return { label: "Unknown", color: "text-gray-400" };
    }
  };

  const { label: strengthLabel, color: strengthColor } = getPasswordStrength();

  return (
    <>
      <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 text-orange-500 bg-gray-700">
        <h1 className="text-white text-center my-3">Password Generator</h1>

        <div className="flex shadow rounded-lg overflow-hidden mb-2">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-1 px-3"
            placeholder="password"
            readOnly
            ref={passwordRef}
            aria-label="Generated password"
          />
          <button
            onClick={copyPasswordToClipboard}
            className="outline-none text-white px-3 pb-1 shrink-0 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
            aria-label="Copy password"
          >
            Copy
          </button>
        </div>

        {copied && (
          <div className="text-green-300 text-sm mb-2 transition-opacity">
            ✅ Password copied to clipboard!
          </div>
        )}

        <div className="flex justify-between items-center text-sm mb-3">
          <span>Password Strength:</span>
          <span className={`font-bold ${strengthColor}`}>{strengthLabel}</span>
        </div>

        <div className="flex text-sm gap-x-2 flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-x-2 mb-2 sm:mb-0">
            <input
              type="range"
              min="6"
              max="35"
              value={length}
              className="cursor-pointer"
              onChange={(e) => setLength(parseInt(e.target.value))}
              aria-label="Password length slider"
            />
            <label htmlFor="lengthSlider">Length: {length}</label>
          </div>

          <div className="flex items-center gap-x-3">
            <div className="flex items-center gap-x-1">
              <input
                type="checkbox"
                id="numberInput"
                checked={numberAllowed}
                onChange={() => setNumberAllowed((prev) => !prev)}
                aria-label="Toggle numbers"
              />
              <label htmlFor="numberInput">Numbers</label>
            </div>

            <div className="flex items-center gap-x-1">
              <input
                type="checkbox"
                id="characterInput"
                checked={charAllowed}
                onChange={() => setCharAllowed((prev) => !prev)}
                aria-label="Toggle special characters"
              />
              <label htmlFor="characterInput">Characters</label>
            </div>
          </div>
        </div>

        <button
          onClick={passwordGenerator}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
          aria-label="Regenerate password"
        >
          🔁 Regenerate Password
        </button>
      </div>
    </>
  );
}

export default App;
