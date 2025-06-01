import React from "react";
import { FaSearch, FaEdit, FaCommentDots } from "react-icons/fa";
import "./service.css";

const services = [
  {
    icon: <FaSearch size={36} />,
    title: "Recherche & Mémorisation",
    description:
      "Recherchez des espèces de poissons et mémorisez vos recherches (réservé aux membres connectés).",
  },
  {
    icon: <FaEdit size={36} />,
    title: "Contribuer à la modification",
    description:
      "Proposez des modifications sur les espèces (édition possible pour les membres connectés, soumise à validation du webmaster).",
  },
  {
    icon: <FaCommentDots size={36} />,
    title: "Laisser un commentaire",
    description:
      "Laissez un commentaire sur une espèce (édition possible, soumise à validation du webmaster).",
  },
];

export default function WikiPoissonsServices() {
  return (
    <div className="wiki-services-container">
      {services.map((service, idx) => (
        <div key={idx} className="wiki-service-card">
          <div className="wiki-service-icon">{service.icon}</div>
          <h3 className="wiki-service-title">{service.title}</h3>
          <p className="wiki-service-desc">{service.description}</p>
        </div>
      ))}
    </div>
  );
}
