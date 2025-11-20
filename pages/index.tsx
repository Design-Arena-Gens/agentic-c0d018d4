import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "../styles/Home.module.css";

type Expression = "peek" | "smile" | "oops" | "giggle";
type Movement = "cover" | "reveal" | "point" | "celebrate";

type SequenceStep = {
  line: string;
  expression: Expression;
  movement: Movement;
  duration: number;
};

const sequence: SequenceStep[] = [
  {
    line: "Peek-a-boo! Johny, Johny!",
    expression: "peek",
    movement: "cover",
    duration: 1700,
  },
  { line: "Yes Papa!", expression: "smile", movement: "reveal", duration: 1400 },
  { line: "Eating sugar?", expression: "oops", movement: "point", duration: 1500 },
  { line: "No Papa!", expression: "smile", movement: "reveal", duration: 1400 },
  { line: "Telling lies?", expression: "oops", movement: "cover", duration: 1500 },
  { line: "No Papa!", expression: "smile", movement: "reveal", duration: 1400 },
  {
    line: "Open your mouth!",
    expression: "oops",
    movement: "celebrate",
    duration: 1500,
  },
  {
    line: "Ha! Ha! Ha!",
    expression: "giggle",
    movement: "celebrate",
    duration: 1800,
  },
];

const sparkles = [
  { id: 0, top: "24%", left: "24%", delay: 0.1 },
  { id: 1, top: "18%", left: "62%", delay: 0.6 },
  { id: 2, top: "32%", left: "76%", delay: 1.1 },
  { id: 3, top: "44%", left: "18%", delay: 0.8 },
  { id: 4, top: "58%", left: "80%", delay: 1.4 },
  { id: 5, top: "68%", left: "26%", delay: 1.9 },
  { id: 6, top: "72%", left: "54%", delay: 1.2 },
  { id: 7, top: "38%", left: "42%", delay: 0.4 },
  { id: 8, top: "60%", left: "66%", delay: 0.9 },
];

const PeekabooCharacter = ({
  expression,
  movement,
  isPlaying,
}: {
  expression: Expression;
  movement: Movement;
  isPlaying: boolean;
}) => {
  const mouthVariants = {
    peek: { width: 36, height: 10, borderRadius: "50% 50% 70% 70%", y: 2 },
    smile: { width: 64, height: 26, borderRadius: "0 0 50% 50%", y: 10 },
    oops: { width: 26, height: 30, borderRadius: "50%", y: 4 },
    giggle: { width: 70, height: 30, borderRadius: "0 0 50% 50%", y: 12 },
  };

  const eyeVariants = {
    peek: { scaleY: 0.1 },
    smile: { scaleY: 1, rotate: 0 },
    oops: { scaleY: 1.2, rotate: 0 },
    giggle: { scaleY: 0.8, rotate: -8 },
  };

  const eyebrowVariants = {
    peek: { y: -6, rotate: 10 },
    smile: { y: -12, rotate: 0 },
    oops: { y: -2, rotate: -6 },
    giggle: { y: -8, rotate: 12 },
  };

  const bodyVariants = {
    idle: { rotate: 0, y: 0 },
    bounce: { rotate: [-1.5, 1.5, -1.5], y: [0, -12, 0] },
  };

  const leftArmVariants = {
    cover: { x: -56, y: -28, rotate: 18 },
    reveal: { x: -48, y: 64, rotate: -28 },
    point: { x: -70, y: 6, rotate: 6 },
    celebrate: { x: -80, y: -16, rotate: -46 },
  };

  const rightArmVariants = {
    cover: { x: 56, y: -28, rotate: -18 },
    reveal: { x: 48, y: 64, rotate: 28 },
    point: { x: 70, y: -8, rotate: 55 },
    celebrate: { x: 80, y: -16, rotate: 46 },
  };

  return (
    <motion.div
      className="character"
      animate={isPlaying ? "bounce" : "idle"}
      variants={bodyVariants}
      transition={{
        duration: 1.6,
        repeat: isPlaying ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      <div className="shadow" />
      <div className="body">
        <motion.div
          className="arm left"
          variants={leftArmVariants}
          animate={movement}
          transition={{ type: "spring", stiffness: 250, damping: 18 }}
        >
          <div className="hand" />
        </motion.div>
        <motion.div
          className="arm right"
          variants={rightArmVariants}
          animate={movement}
          transition={{ type: "spring", stiffness: 250, damping: 18 }}
        >
          <div className="hand" />
        </motion.div>

        <div className="head">
          <motion.div
            className="eyebrow left"
            variants={eyebrowVariants}
            animate={expression}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
          />
          <motion.div
            className="eyebrow right"
            variants={eyebrowVariants}
            animate={expression}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
          />

          <motion.div
            className="eye left"
            variants={eyeVariants}
            animate={expression}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          />
          <motion.div
            className="eye right"
            variants={eyeVariants}
            animate={expression}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          />

          <div className="cheek left" />
          <div className="cheek right" />

          <motion.div
            className="mouth"
            variants={mouthVariants}
            animate={expression}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          />
        </div>
      </div>

      <style jsx>{`
        .character {
          position: relative;
          width: min(320px, 70vw);
          height: min(320px, 70vw);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .shadow {
          position: absolute;
          bottom: 24px;
          width: 70%;
          height: 40px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 50%;
          filter: blur(14px);
        }

        .body {
          position: relative;
          width: 68%;
          height: 74%;
          background: linear-gradient(180deg, #fff0a6 0%, #ffd33d 100%);
          border-radius: 120px;
          border: 6px solid rgba(255, 163, 67, 0.5);
          overflow: visible;
        }

        .head {
          position: absolute;
          top: -22%;
          left: 50%;
          transform: translateX(-50%);
          width: 88%;
          height: 88%;
          border-radius: 50%;
          background: linear-gradient(180deg, #ffe577 0%, #ffc652 100%);
          border: 6px solid rgba(255, 163, 67, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .eye {
          position: absolute;
          top: 42%;
          width: 28px;
          height: 28px;
          background: #2f2a4a;
          border-radius: 50%;
        }

        .eye.left {
          left: 32%;
        }

        .eye.right {
          right: 32%;
        }

        .eyebrow {
          position: absolute;
          top: 32%;
          width: 60px;
          height: 10px;
          background: #2f2a4a;
          border-radius: 50px;
        }

        .eyebrow.left {
          left: 24%;
        }

        .eyebrow.right {
          right: 24%;
        }

        .cheek {
          position: absolute;
          bottom: 28%;
          width: 56px;
          height: 36px;
          background: rgba(255, 140, 167, 0.4);
          border-radius: 50%;
          filter: blur(2px);
        }

        .cheek.left {
          left: 18%;
        }

        .cheek.right {
          right: 18%;
        }

        .mouth {
          position: absolute;
          bottom: 20%;
          background: #ff4d6d;
          border-radius: 50%;
        }

        .arm {
          position: absolute;
          top: 40%;
          width: 140px;
          height: 44px;
          background: linear-gradient(180deg, #ffd66b 0%, #ffb347 100%);
          border-radius: 40px;
          border: 4px solid rgba(255, 163, 67, 0.65);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .arm.left {
          left: -40px;
          transform-origin: 20% 50%;
        }

        .arm.right {
          right: -40px;
          transform-origin: 80% 50%;
        }

        .hand {
          width: 42px;
          height: 42px;
          background: #ffd66b;
          border: 4px solid rgba(255, 163, 67, 0.65);
          border-radius: 50%;
        }

        @media (max-width: 520px) {
          .shadow {
            bottom: 14px;
          }
        }
      `}</style>
    </motion.div>
  );
};

const useSpeechVoices = () => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const speech = window.speechSynthesis;

    const selectVoice = () => {
      const voices = speech.getVoices();
      if (!voices.length) return;
      const friendly =
        voices.find((v) => /child|kid|female/i.test(v.name)) ?? voices[0];
      setVoice(friendly);
    };

    selectVoice();
    speech.addEventListener("voiceschanged", selectVoice);
    return () => speech.removeEventListener("voiceschanged", selectVoice);
  }, []);

  return voice;
};

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [expression, setExpression] = useState<Expression>("smile");
  const [movement, setMovement] = useState<Movement>("reveal");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const voice = useSpeechVoices();

  const clearTimers = useCallback(() => {
    timers.current.forEach((timerId) => clearTimeout(timerId));
    timers.current = [];
  }, []);

  const cancelSpeech = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
  }, []);

  const stopPerformance = useCallback(() => {
    clearTimers();
    cancelSpeech();
    setIsPlaying(false);
    setCurrentStep(null);
    setExpression("smile");
    setMovement("reveal");
  }, [cancelSpeech, clearTimers]);

  const speakLine = useCallback(
    (line: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.pitch = 1.35;
      utterance.rate = 0.88;
      utterance.volume = 0.9;
      if (voice) {
        utterance.voice = voice;
      }
      window.speechSynthesis.speak(utterance);
    },
    [voice]
  );

  const runStep = useCallback(
    (index: number) => {
      const step = sequence[index];
      setCurrentStep(index);
      setExpression(step.expression);
      setMovement(step.movement);
      speakLine(step.line);

      if (index < sequence.length - 1) {
        const timer = setTimeout(() => runStep(index + 1), step.duration);
        timers.current.push(timer);
      } else {
        const timer = setTimeout(() => stopPerformance(), step.duration + 500);
        timers.current.push(timer);
      }
    },
    [speakLine, stopPerformance]
  );

  const startPerformance = useCallback(() => {
    if (isPlaying) return;
    clearTimers();
    cancelSpeech();
    setIsPlaying(true);
    setCurrentStep(0);
    setExpression(sequence[0].expression);
    setMovement(sequence[0].movement);
    speakLine(sequence[0].line);

    const timer = setTimeout(() => runStep(1), sequence[0].duration);
    timers.current.push(timer);
  }, [cancelSpeech, clearTimers, isPlaying, runStep, speakLine]);

  useEffect(() => {
    return () => {
      clearTimers();
      cancelSpeech();
    };
  }, [cancelSpeech, clearTimers]);

  const lyricLines = useMemo(() => sequence.map((step) => step.line), []);

  return (
    <Fragment>
      <Head>
        <title>Peekaboo Johny Johny</title>
        <meta
          name="description"
          content="A playful peekaboo cartoon singing Johny Johny Yes Papa."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Peekaboo Johny Johny</h1>
          <p className={styles.subtitle}>
            Watch a cheerful cartoon pal pop out to sing the classic{" "}
            <strong>“Johny Johny Yes Papa”</strong> rhyme with playful
            peekaboo moves.
          </p>
        </div>

        <section className={styles.stage}>
          <div className={styles.characterWrapper}>
            <PeekabooCharacter
              expression={expression}
              movement={movement}
              isPlaying={isPlaying}
            />
            <AnimatePresence>
              {sparkles.map((sparkle) => (
                <motion.span
                  key={sparkle.id}
                  className={styles.sparkle}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.2, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    repeatDelay: 1.2,
                    delay: sparkle.delay,
                    ease: "easeInOut",
                  }}
                  style={{ top: sparkle.top, left: sparkle.left }}
                />
              ))}
            </AnimatePresence>
          </div>

          <div className={styles.controlPanel}>
            <div className={styles.controlBar}>
              <button
                className={styles.mainButton}
                onClick={startPerformance}
                disabled={isPlaying}
              >
                {isPlaying ? "Singing..." : "Play Peekaboo Show"}
              </button>
              <button className={styles.secondaryButton} onClick={stopPerformance}>
                Stop
              </button>
            </div>

            <div className={styles.lyricCard}>
              <div className={styles.lyricTitle}>
                <span role="img" aria-label="microphone">
                  🎤
                </span>
                Sing along
              </div>
              <div className={styles.lyrics}>
                {lyricLines.map((line, index) => (
                  <span
                    key={line}
                    className={index === currentStep ? styles.activeLyric : undefined}
                  >
                    {line}
                  </span>
                ))}
              </div>
            </div>

            <p className={styles.tips}>
              Tip: Turn your sound on for an auto-sung narration powered by your
              browser&apos;s friendly voice.
            </p>
          </div>
        </section>
      </main>
    </Fragment>
  );
}
