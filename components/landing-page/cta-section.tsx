"use client"

export default function CTASection() {
  return (
    <div className="w-full relative overflow-hidden flex flex-col justify-center items-center gap-2">
      {/* Content */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-12 border-t border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6 relative z-10">
        {/* Background Pattern */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative">
            {Array.from({ length: 300 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-4 w-full rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                style={{
                  top: `${i * 16 - 120}px`,
                  left: "-100%",
                  width: "300%",
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-[650px] px-6 py-5 md:py-8 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-8 relative z-20">
          {/* Badge */}
          <div className="px-4 py-1.5 rounded-full border border-[rgba(55,50,47,0.12)] bg-white shadow-sm text-[13px] font-medium text-[#37322F]">
            🌱 EcoSphere • ESG Management Platform
          </div>

          {/* Heading */}
          <div className="self-stretch flex flex-col justify-start items-center gap-4">
            <h2 className="text-center text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[58px] tracking-tight">
              Build a Smarter,
              <br />
              More Sustainable Organization.
            </h2>

            <p className="max-w-[620px] text-center text-[#605A57] text-base md:text-lg leading-8 font-medium">
              Measure carbon emissions, engage employees through sustainability
              initiatives, manage governance compliance, and generate
              organization-wide ESG insights—all from one intelligent platform.
            </p>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "🌍 Carbon Accounting",
              "👥 CSR & Employee Engagement",
              "🏛 Governance & Compliance",
              "🏆 Challenges • XP • Rewards",
            ].map((item) => (
              <div
                key={item}
                className="px-4 py-2 rounded-full bg-white border border-[rgba(55,50,47,0.10)] text-[13px] text-[#49423D] font-medium"
              >
                {item}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center items-center gap-4">
            <button className="h-10 px-12 py-[6px] relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#2A2520] transition-colors duration-300">
              <div className="w-full h-[41px] absolute left-0 top-0 bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>

              <span className="relative z-10 text-white text-[13px] font-medium leading-5">
                Explore EcoSphere
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}