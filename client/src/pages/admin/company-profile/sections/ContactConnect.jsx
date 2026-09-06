// import {
//   Globe2,
//   Link2,
//   Mail,
//   MapPin,
//   Phone,
// } from "lucide-react";

// import {
//   FaLinkedin,
//   FaInstagram,
//   FaXTwitter,
// } from "react-icons/fa6";

// const fallbackContact = {
//   email: "hello@onewinq.com",
//   phone: "+91 98765 43210",
//   website: "www.onewinq.com",
//   location: "Indore, Madhya Pradesh, India",

//   socialLinks: [
//     {
//       platform: "LinkedIn",
//       url: "https://www.linkedin.com/company/onewinq",
//       Icon: FaLinkedin,
//     },
//     {
//       platform: "Instagram",
//       url: "https://www.instagram.com/onewinq",
//       Icon: FaInstagram,
//     },
//     {
//       platform: "X",
//       url: "https://x.com/onewinq",
//       Icon: FaXTwitter,
//     },
//   ],
// };

// const getLocation = (company) => {

//   const location = company?.location;

//   if (!location) {
//     return fallbackContact.location;
//   }

//   const value = [
//     location.address,
//     location.city,
//     location.state,
//     location.country,
//     location.zipCode,
//   ]
//     .filter(Boolean)
//     .join(", ");

//   return value || fallbackContact.location;
// };

// const getWebsiteUrl = (website) => {

//   if (!website) {
//     return "https://onewinq.com";
//   }

//   return /^https?:\/\//i.test(website)
//     ? website
//     : `https://${website}`;

// };

// export default function ContactConnect({ company }) {

//   const email =
//     company?.contact?.email ||
//     fallbackContact.email;

//   const phone =
//     company?.contact?.phone ||
//     fallbackContact.phone;

//   const website =
//     company?.website ||
//     fallbackContact.website;

//   const socialLinks =
//     company?.socialLinks?.length

//       ? company.socialLinks
//           .filter(
//             (link) => link.isVisible !== false
//           )
//           .map((link) => ({

//             ...link,

//             Icon:

//               link.platform
//                 ?.toLowerCase()
//                 .includes("linkedin")

//                 ? FaLinkedin

//                 : link.platform
//                     ?.toLowerCase()
//                     .includes("instagram")

//                 ? FaInstagram

//                 : link.platform
//                     ?.toLowerCase()
//                     .includes("x") ||
//                   link.platform
//                     ?.toLowerCase()
//                     .includes("twitter")

//                 ? FaXTwitter

//                 : Globe2,

//           }))

//       : fallbackContact.socialLinks;

//   const details = [

//     {
//       label: "Email",
//       value: email,
//       href: `mailto:${email}`,
//       Icon: Mail,
//     },

//     {
//       label: "Phone",
//       value: phone,
//       href: `tel:${phone.replace(/\s+/g, "")}`,
//       Icon: Phone,
//     },

//     {
//       label: "Website",
//       value: website,
//       href: getWebsiteUrl(website),
//       Icon: Link2,
//       external: true,
//     },

//     {
//       label: "Location",
//       value: getLocation(company),
//       Icon: MapPin,
//     },

//   ];

//   return (

//     <section
//       id="contact"
//       className="profile-anchor profile-card profile-card-hover p-3.5"
//     >

//       {/* Header */}

//       <div className="flex items-center justify-between">

//         <div className="flex items-center gap-2 text-[12px] font-bold text-[#37314e]">

//           <span className="grid h-6 w-6 place-items-center rounded-md bg-[#f0ebff] text-[#6340c4]">

//             <Link2 size={13} />

//           </span>

//           Contact & Connect

//         </div>

//         <Globe2
//           size={16}
//           className="text-[#aaa6b5]"
//         />

//       </div>

//       {/* Contact Details */}

//       <div className="mt-3 space-y-2.5">

//         {details.map(
//           ({
//             label,
//             value,
//             href,
//             Icon,
//             external,
//           }) => {

//             const content = (

//               <>

//                 <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#f5f1ff] text-[#6840cf]">

//                   <Icon size={13} />

//                 </span>

//                 <span className="min-w-0">

//                   <span className="block text-[8px] font-semibold uppercase tracking-[0.08em] text-[#aaa6b5]">

//                     {label}

//                   </span>

//                   <span className="mt-0.5 block truncate text-[10px] font-semibold text-[#4b4560]">

//                     {value}

//                   </span>

//                 </span>

//               </>

//             );

//             return href ? (

//               <a
//                 key={label}
//                 href={href}
//                 target={
//                   external
//                     ? "_blank"
//                     : undefined
//                 }
//                 rel={
//                   external
//                     ? "noreferrer"
//                     : undefined
//                 }
//                 className="flex min-w-0 items-center gap-2.5 rounded-lg p-1.5 transition hover:bg-[#faf8ff]"
//               >

//                 {content}

//               </a>

//             ) : (

//               <div
//                 key={label}
//                 className="flex min-w-0 items-center gap-2.5 p-1.5"
//               >

//                 {content}

//               </div>

//             );

//           }

//         )}

//       </div>

//       {/* Social Links */}

//       <div className="mt-3 flex items-center justify-between border-t border-[#efedf5] pt-3">

//         <span className="text-[9px] font-semibold text-[#9793a4]">

//           Follow us

//         </span>

//         <div className="flex items-center gap-1.5">

//           {socialLinks.map(
//             ({
//               platform,
//               url,
//               Icon,
//             }) => (

//               <a
//                 key={platform}
//                 href={url}
//                 target="_blank"
//                 rel="noreferrer"
//                 aria-label={`Visit OneWinq on ${platform}`}
//                 title={platform}
//                 className="grid h-7 w-7 place-items-center rounded-full bg-[#f0ebff] text-[#6840cf] transition hover:bg-[#e4d9ff]"
//               >

//                 <Icon size={14} />

//               </a>

//             )

//           )}

//         </div>

//       </div>

//     </section>

//   );

// }

import { Globe2, Link2, Mail, MapPin, Phone } from "lucide-react";

import { FaLinkedin, FaGithub, FaXTwitter } from "react-icons/fa6";

const fallbackContact = {
  email: "hello@onewinq.com",

  phone: "+91 98765 43210",

  website: "www.onewinq.com",

  location: "Indore, Madhya Pradesh, India",

  socialLinks: [
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/company/onewinq",
      Icon: FaLinkedin,
    },

    {
      platform: "GitHub",
      url: "https://www.github.com/onewinq",
      Icon: FaGithub,
    },

    {
      platform: "X",
      url: "https://x.com/onewinq",
      Icon: FaXTwitter,
    },
  ],
};

const getLocation = (company) => {
  const location = company?.location;

  if (!location) return fallbackContact.location;

  return [
    location.address,
    location.city,
    location.state,
    location.country,
    location.zipCode,
  ]
    .filter(Boolean)
    .join(", ");
};

const getWebsiteUrl = (website) => {
  if (!website) return "https://onewinq.com";

  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
};

export default function ContactConnect({ company }) {
  const email = company?.contact?.email || fallbackContact.email;

  const phone = company?.contact?.phone || fallbackContact.phone;

  const website = company?.website || fallbackContact.website;

  const socialLinks = company?.socialLinks?.length
    ? company.socialLinks
        .filter((link) => link.isVisible !== false)

        .map((link) => {
          const platform = link.platform?.toLowerCase();

          return {
            ...link,

            Icon: platform?.includes("linkedin")
              ? FaLinkedin
              : platform?.includes("github")
                ? FaGithub
                : platform?.includes("twitter") || platform?.includes("x")
                  ? FaXTwitter
                  : Globe2,
          };
        })
    : fallbackContact.socialLinks;

  const details = [
    {
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      Icon: Mail,
    },

    {
      label: "Phone",
      value: phone,
      href: `tel:${phone.replace(/\s+/g, "")}`,
      Icon: Phone,
    },

    {
      label: "Website",
      value: website,
      href: getWebsiteUrl(website),
      Icon: Link2,
      external: true,
    },

    {
      label: "Location",
      value: getLocation(company),
      Icon: MapPin,
    },
  ];

  return (
    <section
      id="contact"
      className="profile-anchor profile-card profile-card-hover p-3.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12px] font-bold text-[#37314e]">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-[#f0ebff] text-[#6340c4]">
            <Link2 size={13} />
          </span>
          Contact & Connect
        </div>

        <Globe2 size={16} className="text-[#aaa6b5]" />
      </div>

      <div className="mt-3 space-y-2.5">
        {details.map(({ label, value, href, Icon, external }) => {
          const content = (
            <>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#f5f1ff] text-[#6840cf]">
                <Icon size={13} />
              </span>

              <span className="min-w-0">
                <span className="block text-[8px] font-semibold uppercase tracking-[0.08em] text-[#aaa6b5]">
                  {label}
                </span>

                <span className="mt-0.5 block truncate text-[10px] font-semibold text-[#4b4560]">
                  {value}
                </span>
              </span>
            </>
          );

          return href ? (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-[#faf8ff]"
            >
              {content}
            </a>
          ) : (
            <div key={label} className="flex items-center gap-2.5 p-1.5">
              {content}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#efedf5] pt-3">
        <span className="text-[9px] font-semibold text-[#9793a4]">
          Follow us
        </span>

        <div className="flex items-center gap-1.5">
          {socialLinks.map(({ platform, url, Icon }) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noreferrer"
              title={platform}
              className="grid h-7 w-7 place-items-center rounded-full bg-[#f0ebff] text-[#6840cf]"
            >
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
