"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer, Circle, Rect, Line, Group, Ellipse } from "react-konva";

interface BodyPartDef {
  key: string;
  audio: string;
}

const bodyPartsList: BodyPartDef[] = [
  { key: "head", audio: "head" },
  { key: "neck", audio: "neck" },
  { key: "leftEar", audio: "left-ear" },
  { key: "rightEar", audio: "right-ear" },
  { key: "chest", audio: "chest" },
  { key: "belly", audio: "belly" },
  { key: "leftArm", audio: "left-arm" },
  { key: "rightArm", audio: "right-arm" },
  { key: "leftForearm", audio: "left-forearm" },
  { key: "rightForearm", audio: "right-forearm" },
  { key: "leftHand", audio: "left-hand" },
  { key: "rightHand", audio: "right-hand" },
  { key: "leftLeg", audio: "left-leg" },
  { key: "rightLeg", audio: "right-leg" },
  { key: "leftKnee", audio: "left-knee" },
  { key: "rightKnee", audio: "right-knee" },
  { key: "leftFoot", audio: "left-foot" },
  { key: "rightFoot", audio: "right-foot" },
];

function findPart(key: string): BodyPartDef {
  return bodyPartsList.find((p) => p.key === key)!;
}

const DESIGN_W = 420;
const DESIGN_H = 680;
const CX = DESIGN_W / 2;

interface HumanBodyProps {
  labels: Record<string, string>;
  tapToLearn: string;
}

export function HumanBody({ labels, tapToLearn }: HumanBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [size, setSize] = useState({ w: 420, h: 680 });
  const [activePart, setActivePart] = useState<string | null>(null);

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const { clientWidth: cw, clientHeight: ch } = containerRef.current;
      const s = Math.min(cw / DESIGN_W, ch / DESIGN_H);
      setSize({ w: DESIGN_W * s, h: DESIGN_H * s });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const scale = size.w / DESIGN_W;

  const playAudio = useCallback((audioKey: string) => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(`/${audioKey}.m4a`);
    audioRef.current = audio;
    audio.play().catch(() => {});
  }, []);

  const tap = useCallback(
    (key: string) => {
      setActivePart(key);
      playAudio(findPart(key).audio);
    },
    [playAudio]
  );

  // Colors matching the reference kid
  const skin = "#F5C5A3";
  const skinDark = "#E0A882";
  const hair = "#3D2314";
  const hairLight = "#5C3A2A";
  const eyeColor = "#2C2C3A";
  const cheek = "#F4A0A0";
  const mouth = "#C0504D";
  const tongue = "#E87070";
  const jacket = "#E8B84B";
  const jacketDark = "#D4A23A";
  const shirt = "#F5E6D8";
  const shorts = "#6B5B95";
  const shortsDark = "#574A7A";
  const sock = "#F0EDE8";
  const sockStripe = "#D0CCC5";
  const shoe = "#D4553A";
  const shoeDark = "#B8402A";
  const hi = "#FFA500";

  const a = (key: string) => activePart === key;
  const c = (key: string, normal: string) => (a(key) ? hi : normal);
  const g = (key: string) => (a(key) ? 14 : 0);

  // Finger helper — draws 5 small lines from a center point
  function renderFingers(cx: number, cy: number, dir: number, partKey: string) {
    const fill = c(partKey, skin);
    const angles = [-55, -30, -5, 18, 38];
    return angles.map((angle, i) => {
      const rad = ((angle * dir) * Math.PI) / 180;
      const len = 13;
      return (
        <Line
          key={`f-${partKey}-${i}`}
          points={[cx, cy, cx + Math.sin(rad) * len, cy + Math.cos(rad) * len]}
          stroke={fill}
          strokeWidth={5}
          lineCap="round"
        />
      );
    });
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 items-center">
      <div className="h-12 flex items-center justify-center mb-2">
        {activePart ? (
          <span key={activePart} className="text-xl sm:text-2xl font-extrabold text-slate-800 animate-[fadeSlideUp_0.3s_ease-out_both]">
            {labels[activePart]}
          </span>
        ) : (
          <span className="text-sm text-slate-500 font-medium">{tapToLearn}</span>
        )}
      </div>

      <div ref={containerRef} className="flex-1 min-h-0 w-full flex items-center justify-center">
        <Stage width={size.w} height={size.h}>
          <Layer scaleX={scale} scaleY={scale}>

            {/* ===== HAIR (behind head) ===== */}
            <Group onClick={() => tap("head")} onTap={() => tap("head")}>
              {/* Main hair mass */}
              <Ellipse x={CX} y={68} radiusX={62} radiusY={55} fill={c("head", hair)} />
              {/* Hair volume — sides */}
              <Ellipse x={CX - 35} y={55} radiusX={35} radiusY={45} fill={c("head", hair)} />
              <Ellipse x={CX + 35} y={55} radiusX={35} radiusY={45} fill={c("head", hair)} />
              {/* Cowlick spikes on top */}
              <Line points={[CX - 8, 18, CX - 2, -2, CX + 5, 15]} fill={c("head", hair)} closed />
              <Line points={[CX + 5, 16, CX + 15, -5, CX + 22, 18]} fill={c("head", hair)} closed />
              <Line points={[CX - 20, 22, CX - 12, 5, CX - 5, 20]} fill={c("head", hair)} closed />
              {/* Side hair tufts */}
              <Line points={[CX - 55, 50, CX - 65, 35, CX - 50, 40]} fill={c("head", hair)} closed />
              <Line points={[CX + 55, 50, CX + 65, 35, CX + 50, 40]} fill={c("head", hair)} closed />
            </Group>

            {/* ===== EARS ===== */}
            <Group onClick={() => tap("leftEar")} onTap={() => tap("leftEar")}>
              <Ellipse x={CX - 55} y={90} radiusX={10} radiusY={13} fill={c("leftEar", skin)} stroke={skinDark} strokeWidth={1} shadowBlur={g("leftEar")} shadowColor="black" shadowOpacity={0.3} />
            </Group>
            <Group onClick={() => tap("rightEar")} onTap={() => tap("rightEar")}>
              <Ellipse x={CX + 55} y={90} radiusX={10} radiusY={13} fill={c("rightEar", skin)} stroke={skinDark} strokeWidth={1} shadowBlur={g("rightEar")} shadowColor="black" shadowOpacity={0.3} />
            </Group>

            {/* ===== HEAD / FACE ===== */}
            <Group onClick={() => tap("head")} onTap={() => tap("head")}>
              {/* Face */}
              <Ellipse x={CX} y={90} radiusX={50} radiusY={48} fill={c("head", skin)} stroke={skinDark} strokeWidth={1.5} shadowBlur={g("head")} shadowColor="black" shadowOpacity={0.3} />

              {/* Eyebrows */}
              <Line points={[CX - 28, 72, CX - 14, 68]} stroke={hair} strokeWidth={3} lineCap="round" />
              <Line points={[CX + 14, 68, CX + 28, 72]} stroke={hair} strokeWidth={3} lineCap="round" />

              {/* Eyes — large anime style */}
              <Ellipse x={CX - 20} y={82} radiusX={12} radiusY={13} fill="white" />
              <Ellipse x={CX + 20} y={82} radiusX={12} radiusY={13} fill="white" />
              <Circle x={CX - 19} y={84} radius={9} fill={eyeColor} />
              <Circle x={CX + 19} y={84} radius={9} fill={eyeColor} />
              {/* Eye highlights */}
              <Circle x={CX - 22} y={80} radius={3.5} fill="white" />
              <Circle x={CX + 16} y={80} radius={3.5} fill="white" />
              <Circle x={CX - 16} y={87} radius={2} fill="white" opacity={0.6} />
              <Circle x={CX + 22} y={87} radius={2} fill="white" opacity={0.6} />

              {/* Nose */}
              <Ellipse x={CX} y={96} radiusX={4} radiusY={3} fill={skinDark} opacity={0.5} />

              {/* Cheeks (blush) */}
              <Ellipse x={CX - 33} y={97} radiusX={9} radiusY={6} fill={cheek} opacity={0.45} />
              <Ellipse x={CX + 33} y={97} radiusX={9} radiusY={6} fill={cheek} opacity={0.45} />

              {/* Mouth — open happy */}
              <Ellipse x={CX} y={110} radiusX={14} radiusY={9} fill={mouth} />
              {/* Tongue */}
              <Ellipse x={CX} y={115} radiusX={8} radiusY={5} fill={tongue} />
              {/* Teeth line */}
              <Line points={[CX - 10, 107, CX + 10, 107]} stroke="white" strokeWidth={3} lineCap="round" />
            </Group>

            {/* ===== NECK ===== */}
            <Group onClick={() => tap("neck")} onTap={() => tap("neck")}>
              <Rect x={CX - 14} y={133} width={28} height={22} fill={c("neck", skin)} shadowBlur={g("neck")} shadowColor="black" shadowOpacity={0.3} />
            </Group>

            {/* ===== LEFT ARM (upper — jacket sleeve) ===== */}
            <Group onClick={() => tap("leftArm")} onTap={() => tap("leftArm")}>
              <Line
                points={[CX - 70, 175, CX - 115, 160, CX - 120, 185, CX - 72, 200]}
                fill={c("leftArm", jacket)}
                closed stroke={c("leftArm", jacketDark)} strokeWidth={1.5}
                shadowBlur={g("leftArm")} shadowColor="black" shadowOpacity={0.3}
              />
            </Group>

            {/* ===== RIGHT ARM (upper — jacket sleeve) ===== */}
            <Group onClick={() => tap("rightArm")} onTap={() => tap("rightArm")}>
              <Line
                points={[CX + 70, 175, CX + 115, 160, CX + 120, 185, CX + 72, 200]}
                fill={c("rightArm", jacket)}
                closed stroke={c("rightArm", jacketDark)} strokeWidth={1.5}
                shadowBlur={g("rightArm")} shadowColor="black" shadowOpacity={0.3}
              />
            </Group>

            {/* ===== LEFT FOREARM (skin) ===== */}
            <Group onClick={() => tap("leftForearm")} onTap={() => tap("leftForearm")}>
              <Line
                points={[CX - 115, 158, CX - 140, 145, CX - 148, 165, CX - 120, 182]}
                fill={c("leftForearm", skin)}
                closed stroke={c("leftForearm", skinDark)} strokeWidth={1}
                shadowBlur={g("leftForearm")} shadowColor="black" shadowOpacity={0.3}
              />
            </Group>

            {/* ===== RIGHT FOREARM (skin) ===== */}
            <Group onClick={() => tap("rightForearm")} onTap={() => tap("rightForearm")}>
              <Line
                points={[CX + 115, 158, CX + 140, 145, CX + 148, 165, CX + 120, 182]}
                fill={c("rightForearm", skin)}
                closed stroke={c("rightForearm", skinDark)} strokeWidth={1}
                shadowBlur={g("rightForearm")} shadowColor="black" shadowOpacity={0.3}
              />
            </Group>

            {/* ===== LEFT HAND + FINGERS ===== */}
            <Group onClick={() => tap("leftHand")} onTap={() => tap("leftHand")}>
              {renderFingers(CX - 148, 152, -1, "leftHand")}
              <Ellipse x={CX - 147} y={155} radiusX={11} radiusY={9} fill={c("leftHand", skin)} stroke={skinDark} strokeWidth={1} shadowBlur={g("leftHand")} shadowColor="black" shadowOpacity={0.3} />
            </Group>

            {/* ===== RIGHT HAND + FINGERS ===== */}
            <Group onClick={() => tap("rightHand")} onTap={() => tap("rightHand")}>
              {renderFingers(CX + 148, 152, 1, "rightHand")}
              <Ellipse x={CX + 147} y={155} radiusX={11} radiusY={9} fill={c("rightHand", skin)} stroke={skinDark} strokeWidth={1} shadowBlur={g("rightHand")} shadowColor="black" shadowOpacity={0.3} />
            </Group>

            {/* ===== CHEST (jacket + shirt) ===== */}
            <Group onClick={() => tap("chest")} onTap={() => tap("chest")}>
              {/* Jacket body */}
              <Line
                points={[
                  CX - 70, 152,
                  CX - 25, 152,
                  CX - 20, 155,
                  CX, 160,
                  CX + 20, 155,
                  CX + 25, 152,
                  CX + 70, 152,
                  CX + 68, 260,
                  CX - 68, 260,
                ]}
                fill={c("chest", jacket)}
                closed stroke={c("chest", jacketDark)} strokeWidth={1.5}
                shadowBlur={g("chest")} shadowColor="black" shadowOpacity={0.3}
              />
              {/* White shirt underneath (V shape) */}
              <Line
                points={[
                  CX - 28, 152,
                  CX, 200,
                  CX + 28, 152,
                  CX + 22, 260,
                  CX - 22, 260,
                ]}
                fill={c("chest", shirt)}
                closed
              />
              {/* Shirt collar neckline */}
              <Line
                points={[CX - 20, 153, CX, 165, CX + 20, 153]}
                stroke={c("chest", "#D5C8B8")}
                strokeWidth={2}
                lineCap="round"
              />
            </Group>

            {/* ===== BELLY ===== */}
            <Group onClick={() => tap("belly")} onTap={() => tap("belly")}>
              <Rect
                x={CX - 68} y={260} width={136} height={45}
                fill={c("belly", jacket)}
                stroke={c("belly", jacketDark)} strokeWidth={1.5}
                cornerRadius={[0, 0, 6, 6]}
                shadowBlur={g("belly")} shadowColor="black" shadowOpacity={0.3}
              />
              {/* Shirt continues */}
              <Rect x={CX - 22} y={260} width={44} height={45} fill={c("belly", shirt)} cornerRadius={[0, 0, 4, 4]} />
            </Group>

            {/* ===== LEFT LEG (thigh — shorts) ===== */}
            <Group onClick={() => tap("leftLeg")} onTap={() => tap("leftLeg")}>
              <Line
                points={[
                  CX - 60, 305,
                  CX - 8, 305,
                  CX - 15, 410,
                  CX - 55, 410,
                ]}
                fill={c("leftLeg", shorts)}
                closed stroke={c("leftLeg", shortsDark)} strokeWidth={1.5}
                shadowBlur={g("leftLeg")} shadowColor="black" shadowOpacity={0.3}
              />
            </Group>

            {/* ===== RIGHT LEG (thigh — shorts, slightly angled) ===== */}
            <Group onClick={() => tap("rightLeg")} onTap={() => tap("rightLeg")}>
              <Line
                points={[
                  CX + 8, 305,
                  CX + 60, 305,
                  CX + 75, 400,
                  CX + 25, 410,
                ]}
                fill={c("rightLeg", shorts)}
                closed stroke={c("rightLeg", shortsDark)} strokeWidth={1.5}
                shadowBlur={g("rightLeg")} shadowColor="black" shadowOpacity={0.3}
              />
            </Group>

            {/* ===== LEFT KNEE (skin) ===== */}
            <Group onClick={() => tap("leftKnee")} onTap={() => tap("leftKnee")}>
              <Ellipse
                x={CX - 35} y={420}
                radiusX={20} radiusY={14}
                fill={c("leftKnee", skin)} stroke={c("leftKnee", skinDark)} strokeWidth={1}
                shadowBlur={g("leftKnee")} shadowColor="black" shadowOpacity={0.3}
              />
            </Group>

            {/* ===== RIGHT KNEE (skin) ===== */}
            <Group onClick={() => tap("rightKnee")} onTap={() => tap("rightKnee")}>
              <Ellipse
                x={CX + 52} y={415}
                radiusX={20} radiusY={14}
                fill={c("rightKnee", skin)} stroke={c("rightKnee", skinDark)} strokeWidth={1}
                shadowBlur={g("rightKnee")} shadowColor="black" shadowOpacity={0.3}
              />
            </Group>

            {/* ===== LEFT SHIN (sock — striped) ===== */}
            <Group onClick={() => tap("leftLeg")} onTap={() => tap("leftLeg")}>
              <Line
                points={[CX - 52, 432, CX - 18, 432, CX - 20, 540, CX - 50, 540]}
                fill={c("leftLeg", sock)} closed stroke={c("leftLeg", sockStripe)} strokeWidth={1}
              />
              {/* Sock stripes */}
              {[450, 468, 486, 504, 522].map((y) => (
                <Line key={`ls-${y}`} points={[CX - 50, y, CX - 20, y]} stroke={sockStripe} strokeWidth={1.5} />
              ))}
            </Group>

            {/* ===== RIGHT SHIN (sock — striped, angled) ===== */}
            <Group onClick={() => tap("rightLeg")} onTap={() => tap("rightLeg")}>
              <Line
                points={[CX + 35, 428, CX + 68, 425, CX + 82, 530, CX + 48, 535]}
                fill={c("rightLeg", sock)} closed stroke={c("rightLeg", sockStripe)} strokeWidth={1}
              />
              {/* Sock stripes */}
              {[445, 463, 481, 499, 517].map((y) => (
                <Line key={`rs-${y}`} points={[CX + 40, y, CX + 72, y]} stroke={sockStripe} strokeWidth={1.5} />
              ))}
            </Group>

            {/* ===== LEFT FOOT (orange sneaker) ===== */}
            <Group onClick={() => tap("leftFoot")} onTap={() => tap("leftFoot")}>
              <Ellipse
                x={CX - 42} y={550}
                radiusX={28} radiusY={14}
                fill={c("leftFoot", shoe)} stroke={c("leftFoot", shoeDark)} strokeWidth={2}
                shadowBlur={g("leftFoot")} shadowColor="black" shadowOpacity={0.3}
              />
              {/* Sole */}
              <Rect x={CX - 68} y={558} width={52} height={6} fill={c("leftFoot", shoeDark)} cornerRadius={3} />
              {/* Shoe detail lines */}
              <Line points={[CX - 55, 547, CX - 35, 545]} stroke="white" strokeWidth={1.5} opacity={0.4} lineCap="round" />
            </Group>

            {/* ===== RIGHT FOOT (orange sneaker, angled) ===== */}
            <Group onClick={() => tap("rightFoot")} onTap={() => tap("rightFoot")}>
              <Ellipse
                x={CX + 72} y={542}
                radiusX={28} radiusY={14}
                fill={c("rightFoot", shoe)} stroke={c("rightFoot", shoeDark)} strokeWidth={2}
                rotation={15}
                shadowBlur={g("rightFoot")} shadowColor="black" shadowOpacity={0.3}
              />
              <Rect x={CX + 50} y={550} width={48} height={6} fill={c("rightFoot", shoeDark)} cornerRadius={3} rotation={5} />
              <Line points={[CX + 58, 540, CX + 78, 536]} stroke="white" strokeWidth={1.5} opacity={0.4} lineCap="round" />
            </Group>

          </Layer>
        </Stage>
      </div>
    </div>
  );
}
