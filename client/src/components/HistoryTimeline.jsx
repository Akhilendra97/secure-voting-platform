import { useState } from "react";

const elections = [/* SAME DATA */
  {
    year: "1951-52",
    name: "Jawaharlal Nehru",
    party: "INC",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Jawaharlal_Nehru%2C_circa_1925.jpg/250px-Jawaharlal_Nehru%2C_circa_1925.jpg",
    details: "India's first Prime Minister. Architect of modern India.",
  },
  {
    year: "1957",
    name: "Jawaharlal Nehru",
    party: "INC",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC8iUT1IGWFz2r563PegTpNI6CKwo1-CucYfehoZZxGhBtLjAUfsdF5Cm2oeP01McjLbIcrfJf_kJzIUvLTFbidctSvg1H0uxzN3KwXg&s=10",
    details: "Second term with continued development.",
  },
  {
    year: "1962",
    name: "Jawaharlal Nehru",
    party: "INC",
    img: "https://m.media-amazon.com/images/M/MV5BMjI3MDg1NjM3OF5BMl5BanBnXkFtZTcwMzg4NzkyOA@@._V1_.jpg",
    details: "Third consecutive victory.",
  },
  {
    year: "1967",
    name: "Indira Gandhi",
    party: "INC",
    img: "https://www.thoughtco.com/thmb/PE7NX-WgsRGkluBMKBxtM6KR_gE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/IndiraGandhi1983HultonGetty-56a042a63df78cafdaa0b882.jpg",
    details: "Faced strong opposition.",
  },
  {
    year: "1971",
    name: "Indira Gandhi",
    party: "INC",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSXgQgV3f0wcsvADVng1LILWETMqDv3-Gibg&s",
    details: "Garibi Hatao campaign victory.",
  },
  {
    year: "1977",
    name: "Morarji Desai",
    party: "Janata Party",
    img: "https://cdn.britannica.com/13/266013-050-AFFBB0BA/India-Prime-Minister-Morarji-Desai-1977.jpg",
    details: "First non-Congress government.",
  },
  {
    year: "1980",
    name: "Indira Gandhi",
    party: "INC",
    img: "https://static.india.com/wp-content/uploads/2024/03/QT-PM8.jpg",
    details: "Returned to power.",
  },
  {
    year: "1984",
    name: "Rajiv Gandhi",
    party: "INC",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkru9DrBDs8KfU7DHzBY3jfE50ab10P1HmEA&s",
    details: "Historic majority win.",
  },
  {
    year: "1989",
    name: "V. P. Singh",
    party: "Janata Dal",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvd8cK2GEnEwRmqmtQA37zOxcCdrHpMqfXUQ&s",
    details: "Mandal reforms.",
  },
  {
    year: "1991",
    name: "P. V. Narasimha Rao",
    party: "INC",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlL3MDnUYInyY1g5UrowqjwlvsFTmGe-ETkw&s",
    details: "Economic liberalization.",
  },
  {
    year: "1996",
    name: "Atal Bihari Vajpayee",
    party: "BJP",
    img: "https://ddindia.co.in/wp-content/uploads/2023/08/atal-bihari-vajpayee.jpg",
    details: "First BJP PM.",
  },
  {
    year: "1998",
    name: "Atal Bihari Vajpayee",
    party: "BJP",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-8_qCPCwZhLM7s51-UoW2fXNH8Dl2PHsppQ&s",
    details: "Nuclear tests.",
  },
  {
    year: "1999",
    name: "Atal Bihari Vajpayee",
    party: "BJP",
    img: "https://www.bjp.org/files/photo-gallery/atalji-01a_21.jpg",
    details: "Stable govt.",
  },
  {
    year: "2004",
    name: "Manmohan Singh",
    party: "INC",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3Xw1HOnV9aW7_mHOHVqZXnHjjHQ0X_tctAg&s",
    details: "Economic growth.",
  },
  {
    year: "2009",
    name: "Manmohan Singh",
    party: "INC",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_sHFj6PZPpo-3A744N4WdvAOFm6r4zhUZgw&s",
    details: "Second term.",
  },
  {
    year: "2014",
    name: "Narendra Modi",
    party: "BJP",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEYEI5nU2R_FOfpmEBKHJW7TXrT7PKTdmtAw&s",
    details: "Historic majority.",
  },
  {
    year: "2019",
    name: "Narendra Modi",
    party: "BJP",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl4dWktUS1t2byYRgTny-hP_N9WVOJT00RDg&s",
    details: "Second term.",
  },
   {
    year: "2024",
    name: "Narendra Modi",
    party: "BJP",
    img: "https://akm-img-a-in.tosshub.com/indiatoday/images/author/modi_0-profile_image_one_to_one.jpg?VersionId=Ewox2GiDm1KsXs2VWa3Hw5U4GpPb5y2M",
    details: "Third term.",
  }
];
const timeline = [/* SAME DATA */
  {
    year: "1947",
    title: "Independence of India",
    desc: "India gained independence and began its journey towards democracy.",
    full: "On 15th August 1947, India achieved independence from British rule. This marked the beginning of the world's largest democracy. Leaders like Mahatma Gandhi and Jawaharlal Nehru played crucial roles in shaping the nation.",
    img: "https://akm-img-a-in.tosshub.com/sites/media2/indiatoday/images/stories/1976August/independence-day-1_043015040308.jpg",
  },
  {
    year: "1951",
    title: "First General Election",
    desc: "India conducted its first general elections.",
    full: "India's first general elections (1951-52) were the largest democratic exercise in the world at that time. Over 170 million people were eligible to vote, setting a global example.",
    img: "https://cdn.wionews.com/sites/default/files/2019/04/09/89239-untitled-design-28.jpg",
  },
  {
    year: "1991",
    title: "Economic Reforms",
    desc: "Major reforms transformed India.",
    full: "In 1991, India introduced economic liberalization policies which transformed the country's economy and political landscape, leading to globalization and modernization.",
    img: "data:image/jpeg;base64,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",
  },
  {
    year: "2004",
    title: "Electronic Voting Machines",
    desc: "EVMs were adopted nationwide.",
    full: "India became one of the first countries to fully adopt Electronic Voting Machines (EVMs), ensuring faster, secure, and reliable elections.",
    img: "https://media.licdn.com/dms/image/v2/D5612AQG3rRz7QH7yrg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1729332559986?e=2147483647&v=beta&t=65sRgyhbXMLM6OSr8LLTjTneelzg521emaAxRoIRY7A",
  },
  {
    year: "2020+",
    title: "Digital Voting Era",
    desc: "Secure online voting systems emerging.",
    full: "With technological advancements, India is exploring secure digital and blockchain-based voting systems to enhance transparency and accessibility.",
    img: "https://static.scientificamerican.com/sciam/cache/file/CF393A78-1DF6-4D70-BF862AC7CA0ACC02_source.jpg",
  },
];

function HistoryTimeline() {
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedLeader, setSelectedLeader] = useState(null);

  return (
    <div
      className="min-h-screen text-white bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://media.assettype.com/theleaflet%2Fimport%2Fwp-content%2Fuploads%2F2022%2F05%2FParliament-8.png?w=1024&auto=format%2Ccompress&fit=maxs')",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 px-6 pt-6 max-w-7xl mx-auto">

        {/* ✅ STICKY TRANSPARENT HEADER */}
        <div className="sticky top-16 z-50 bg-transparent backdrop-blur-md pb-4">

          <h1 className="text-4xl text-center text-yellow-400 mb-6 pt-4">
            Journey of Indian Democracy
          </h1>

          <div className="grid lg:grid-cols-5 gap-10 items-start">
            <h2 className="lg:col-span-3 text-2xl font-bold border-b border-white/10 pb-2 text-cyan-400">
              📜 Indian History Timeline
            </h2>

            <h2 className="lg:col-span-2 text-2xl font-bold border-b border-white/10 pb-2 text-green-400">
              🏆 Election Winners (1951-Present)
            </h2>
          </div>

        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-5 gap-10 mt-6">

          {/* ================= TIMELINE ================= */}
          <div className="lg:col-span-3 pr-4 space-y-10 relative">

            {/* GLOW LINE */}
            <div className="absolute left-[85px] top-0 bottom-0 w-[2px] 
            bg-gradient-to-b from-cyan-400 via-cyan-400/60 to-transparent z-0"></div>

            {timeline.map((item, index) => (
              <div
                key={index}
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex gap-6 items-stretch cursor-pointer group"
              >

                {/* IMAGE */}
                <div className="w-[170px] h-full flex-shrink-0 overflow-hidden rounded-xl bg-black/30 p-[2px] relative z-10">
                  <img
                    src={item.img}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* CARD */}
                <div className="flex-1 h-full p-5 rounded-xl flex flex-col justify-between relative z-10
                  bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg 
                  border border-cyan-400/30
                  hover:border-cyan-400
                  hover:bg-white/20
                  hover:translate-y-[-4px] hover:z-20
                  hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]
                  transition duration-300"
                >
                  <div className="flex flex-col h-full justify-between">

                    <div>
                      <h2 className="text-cyan-400 text-sm font-semibold">
                        {item.year}
                      </h2>

                      <h3 className="font-bold text-white text-lg">
                        {item.title}
                      </h3>

                      <p className="text-gray-400 text-sm">
                        {item.desc}
                      </p>

                      {openIndex === index && (
                        <p className="text-gray-300 text-sm mt-2 border-t border-white/10 pt-2">
                          {item.full}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-400 mt-2">
                        Click to view details →
                      </p>

                      <div className="mt-2 h-[1px] bg-white/10"></div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= WINNERS ================= */}
          <div className="lg:col-span-2 pl-2 pr-4 space-y-4
          sticky top-24 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pt-10">

            {elections.map((e, i) => (
              <div
                key={i}
                onClick={() => setSelectedLeader(e)}
                className="flex gap-4 items-stretch p-4 rounded-xl relative z-10
                bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg 
                border border-green-400/30
                hover:border-green-400
                hover:bg-white/20
                hover:translate-y-[-4px] hover:z-20
                hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]
                transition duration-300 cursor-pointer"
              >

                {/* IMAGE */}
                <div className="w-16 h-full flex-shrink-0 bg-black/30 p-2 rounded-full flex items-center justify-center">
                  <img
                    src={e.img}
                    className="w-12 h-12 rounded-full object-cover border border-white/20"
                  />
                </div>

                {/* CARD CONTENT */}
                <div className="flex-1 flex flex-col justify-between">

                  <div>
                    <p className="font-semibold text-white text-sm">
                      {e.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {e.year}
                    </p>

                    <span className="mt-1 inline-block text-[10px] px-2 py-[2px] rounded-full 
                    bg-green-500/20 text-green-400 border border-green-400/30">
                      {e.party}
                    </span>
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-400 mt-2">
                      Click to view details →
                    </p>

                    <div className="mt-2 h-[1px] bg-white/10"></div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* MODAL */}
      {selectedLeader && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="p-6 rounded-xl text-center max-w-sm bg-white/10 backdrop-blur-lg">

            <img
              src={selectedLeader.img}
              className="w-20 h-20 rounded-full mx-auto mb-3"
            />

            <h2 className="text-xl font-bold">
              {selectedLeader.name}
            </h2>

            <p className="text-green-400 text-sm">
              {selectedLeader.party}
            </p>

            <p className="text-gray-300 mt-2">
              {selectedLeader.details}
            </p>

            <button
              onClick={() => setSelectedLeader(null)}
              className="mt-4 bg-red-500 px-4 py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryTimeline;