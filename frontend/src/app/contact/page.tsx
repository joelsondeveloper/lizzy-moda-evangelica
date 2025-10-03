"use client";

import {
  AiOutlinePhone,
  AiOutlineWhatsApp,
  AiOutlineMail,
  AiOutlineInstagram,
  AiOutlineEnvironment,
  AiOutlineHome,
  AiOutlineBank,
  AiOutlineClockCircle,
} from "react-icons/ai";

const Page: React.FC = () => {
  const contacts = [
    {
      icon: <AiOutlinePhone size="50%" />,
      label: "Telefone:",
      value: "(81) 98761-2791",
    },
    {
      icon: <AiOutlineWhatsApp size="50%" />,
      label: "WhatsApp:",
      value: "(81) 98761-2791",
    },
    {
      icon: <AiOutlineMail size="50%" />,
      label: "E-mail:",
      value: "quintinoliziane@gmail.com",
    },
    {
      icon: <AiOutlineInstagram size="50%" />,
      label: "Instagram:",
      value: "@lizzymodaevangelica",
    },
  ];

  const locations = [
    {
      icon: <AiOutlineHome size="1.25rem" />,
      label: "R. Manoel Maria Caetano Bom, 109 - Centro",
    },
    {
      icon: <AiOutlineBank size="1.25rem" />,
      label: "Cabo de Santo Agostinho - PE, 54505-020",
    },
    {
      icon: <AiOutlineClockCircle size="1.25rem" />,
      label: "Horario de Funcionamento:",
      value: `Segunda a Sabado - 08:00 às 18:00 - Domingo: Fechado`,
    },
  ];

  return (
    <section className="p-[clamp(1rem,2vw,2.5rem)] flex justify-center">
      <div className="bg-page-background-light dark:bg-page-background-dark rounded-2xl p-[clamp(1rem,2vw,2.5rem)] max-w-[62.5rem] flex flex-col justify-center gap-4">
        <h2 className="text-center font-playfair text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Nossa Loja Física & Contato
        </h2>
        <div className="content flex flex-col gap-12">
          <div className="contact flex flex-col gap-6 pb-6 border-b-2 border-text-muted-light dark:border-text-muted-dark">
            <h3 className="font-playfair text-2xl font-semibold">
              Fale Conosco
            </h3>
            <ul className="flex gap-y-8 flex-wrap">
              {contacts.map((contact, index) => (
                <li
                  key={index}
                  className="flex w-full sm:w-[50%] gap-4 items-center"
                >
                  <span className="icon w-12 aspect-square rounded-full flex items-center justify-center border-2 border-primary-accent-light dark:border-primary-accent-dark">
                    {contact.icon}
                  </span>
                  <div className="info flex flex-col gap-2">
                    <span className="label font-medium text-sm">
                      {contact.label}
                    </span>
                    <span className="value font-semibold">{contact.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="location flex flex-col gap-6">
            <header className="flex gap-3 items-center">
              <AiOutlineEnvironment size="1.5rem" />
              <h3 className="font-playfair text-2xl font-semibold">
                Nossa Loja Física
              </h3>
            </header>
            <div className="details flex flex-col gap-5">
              <div className="info flex flex-col gap-4">
                {locations.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark"
                  >
                    {location.icon}
                    <div className="info flex flex-col gap-1">
                      <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {location.label}
                      </span>
                      {location.value && <span>{location.value}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d987.0299628607744!2d-35.043226230494014!3d-8.290869772394975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7aaf01ccc7b889d%3A0x19fb76750b36e7a0!2sR.%20Manoel%20Maria%20Caetano%20Bom%2C%20109%20-%20Centro%2C%20Cabo%20de%20Santo%20Agostinho%20-%20PE%2C%2054505-020!5e0!3m2!1spt-BR!2sbr!4v1759436807267!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: "1rem" }}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
