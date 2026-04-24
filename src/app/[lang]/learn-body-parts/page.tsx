import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/dictionaries";
import { HumanBody } from "@/components/human-body";
import { FloatingDecorations } from "@/components/floating-decorations";

export default async function LearnBodyParts({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const labels: Record<string, string> = {
    head: dict.bodyParts.head,
    neck: dict.bodyParts.neck,
    leftEar: dict.bodyParts.leftEar,
    rightEar: dict.bodyParts.rightEar,
    chest: dict.bodyParts.chest,
    belly: dict.bodyParts.belly,
    leftArm: dict.bodyParts.leftArm,
    rightArm: dict.bodyParts.rightArm,
    leftForearm: dict.bodyParts.leftForearm,
    rightForearm: dict.bodyParts.rightForearm,
    leftHand: dict.bodyParts.leftHand,
    rightHand: dict.bodyParts.rightHand,
    leftLeg: dict.bodyParts.leftLeg,
    rightLeg: dict.bodyParts.rightLeg,
    leftKnee: dict.bodyParts.leftKnee,
    rightKnee: dict.bodyParts.rightKnee,
    leftFoot: dict.bodyParts.leftFoot,
    rightFoot: dict.bodyParts.rightFoot,
  };

  return (
    <div className="h-dvh flex flex-col bg-gradient-to-b from-amber-50 via-sky-50 to-purple-50 font-sans overflow-hidden relative">
      <FloatingDecorations />
      <div className="relative z-10 flex flex-col flex-1 min-h-0 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-3 mb-3 sm:mb-4 animate-[fadeSlideUp_0.6s_ease-out_both]">
          <Link
            href={`/${lang}`}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-sm font-bold text-slate-600 shadow-md transition-all duration-300 hover:shadow-lg hover:bg-white hover:-translate-y-0.5 tap-target"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {dict.common.back}
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center">
              <Heart className="size-4 text-rose-500" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-700">
              {dict.bodyParts.heading}
            </h1>
          </div>
        </div>

        <HumanBody labels={labels} tapToLearn={dict.bodyParts.tapToLearn} />
      </div>
    </div>
  );
}
