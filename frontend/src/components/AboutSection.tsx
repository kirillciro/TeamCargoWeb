import Image from "next/image";
import { CheckCircle2, Users, MapPin } from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";

export default function AboutSection({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="about"
      className="bg-white bg-pattern py-14 sm:py-20 lg:py-28 overflow-hidden lg:min-h-screen lg:flex lg:flex-col lg:justify-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[#36B347] text-xs font-bold uppercase tracking-[0.25em]">
            {dict.about.label}
          </span>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#36B347]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Text — left */}
          <div className="mt-8 lg:mt-0">
            <h2
              className="text-gray-900 font-extrabold tracking-tight mb-5"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}
            >
              {dict.about.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-base">
              {dict.about.description}
            </p>
            <p className="text-gray-600 leading-relaxed mb-7 text-base">
              {dict.about.description2}
            </p>

            <h3 className="font-bold text-[#1a7f45] mb-3 text-xs uppercase tracking-widest">
              {dict.about.values_title}
            </h3>
            <ul className="grid grid-cols-2 gap-2.5 mb-7">
              {dict.about.values.map((val) => (
                <li key={val} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#36B347] shrink-0" />
                  <span className="text-gray-700 text-[0.92rem] font-semibold">
                    {val}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 border border-[#36B347]/25"
                style={{
                  background:
                    "linear-gradient(135deg, #e8f8ec 0%, #d0f0d8 100%)",
                }}
              >
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #36B347 0%, #1a7f45 100%)",
                  }}
                >
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-[0.92rem] font-bold text-[#1a7f45]">
                  {dict.about.drivers_placed}
                </span>
              </div>
              <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 border border-[#36B347]/25"
                style={{
                  background:
                    "linear-gradient(135deg, #e8f8ec 0%, #d0f0d8 100%)",
                }}
              >
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #36B347 0%, #1a7f45 100%)",
                  }}
                >
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-[0.92rem] font-bold text-[#1a7f45]">
                  Amsterdam, Netherlands
                </span>
              </div>
            </div>
          </div>

          {/* Right — photo collage */}
          <div className="relative">
            <div className="relative h-105 sm:h-125">
              {/* Back — tall portrait image, left side */}
              <div className="absolute top-0 left-0 w-[62%] h-[88%] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/amazon_courier_webP.webp"
                  alt="Amazon driver with package"
                  fill
                  className="object-cover object-top-right"
                  sizes="(max-width: 768px) 60vw, 30vw"
                />
              </div>
              {/* Front — horizontal team photo, bottom-right, overlapping */}
              <div className="absolute bottom-0 right-0 w-[72%] h-[52%] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white">
                <Image
                  src="/images/cargoTeam_webP.webp"
                  alt="Team Cargo team"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 70vw, 36vw"
                />
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-2 sm:left-4 bg-[#1a7f45] text-white rounded-2xl px-5 py-4 shadow-2xl">
              <p className="font-extrabold text-2xl leading-none">7+</p>
              <p className="text-white/65 text-xs uppercase tracking-wider font-bold mt-1">
                {dict.about.years_active}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
