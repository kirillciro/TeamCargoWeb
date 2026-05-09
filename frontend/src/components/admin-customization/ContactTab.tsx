"use client";

import React from "react";
import { Loader2, Check, Save } from "lucide-react";
import Image from "next/image";
import CloudinaryLogoUpload from "../CloudinaryLogoUpload";
import { CONTACT_ICON_OPTS } from "./types";
import { useAdminCustomization } from "./AdminCustomizationContext";

export default function ContactTab() {
  const {
    win98,
    contactTitle,
    setContactTitle,
    contactSubtitle,
    setContactSubtitle,
    contactPhoneLabel,
    setContactPhoneLabel,
    contactEmailLabel,
    setContactEmailLabel,
    contactAddressLabel,
    setContactAddressLabel,
    contactMapPin,
    setContactMapPin,
    contactWhatsapp,
    setContactWhatsapp,
    contactEmailAddress,
    setContactEmailAddress,
    contactMapAddress,
    setContactMapAddress,
    contactImg,
    setContactImg,
    contactSectionSaved,
    contactTranslating,
    contactTranslateError,
    contactSavingAll,
    contactAllSaved,
    contactTranslationPending,
    contactRowIcons,
    setContactRowIcons,
    contactIconPicker,
    setContactIconPicker,
    contactIconPages,
    setContactIconPages,
    buildContactSource,
    persistContact,
    saveAllContact,
    resetAllContact,
  } = useAdminCustomization();

  return (
    <>
      {win98 &&
        (() => {
          const F = '"MS Sans Serif", Arial, sans-serif';
          const GRP: React.CSSProperties = {
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            background: "#c0c0c0",
            padding: "18px 12px 12px",
            position: "relative",
          };
          const GRP_LBL: React.CSSProperties = {
            position: "absolute",
            top: -9,
            left: 10,
            background: "#c0c0c0",
            padding: "0 4px",
            fontSize: 11,
            fontWeight: "bold",
            color: "#000",
            fontFamily: F,
            whiteSpace: "nowrap",
          };
          const HR: React.CSSProperties = {
            borderTop: "1px solid #808080",
            borderBottom: "1px solid #fff",
            margin: "8px 0",
          };
          const INPUT: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#fff",
            color: "#000",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "2px 4px",
            width: "100%",
            boxSizing: "border-box" as const,
          };
          const TEXTAREA: React.CSSProperties = {
            ...INPUT,
            resize: "vertical" as const,
            display: "block",
          };
          const BTN: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            background: "#c0c0c0",
            color: "#000",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            padding: "3px 14px",
            cursor: "pointer",
            minWidth: 68,
          };
          const BTN_LG: React.CSSProperties = {
            ...BTN,
            padding: "4px 22px",
            fontWeight: "bold",
          };
          const LBL: React.CSSProperties = {
            fontFamily: F,
            fontSize: 11,
            color: "#000",
            display: "block",
            marginBottom: 2,
          };

          const contactRowDefs = [
            {
              key: "phone",
              label: "Phone / WhatsApp label",
              placeholder: "WhatsApp",
              value: contactPhoneLabel,
              setter: setContactPhoneLabel,
            },
            {
              key: "email",
              label: "Email label",
              placeholder: "E-mail",
              value: contactEmailLabel,
              setter: setContactEmailLabel,
            },
            {
              key: "address",
              label: "Address label",
              placeholder: "Address",
              value: contactAddressLabel,
              setter: setContactAddressLabel,
            },
          ] as {
            key: string;
            label: string;
            placeholder: string;
            value: string;
            setter: (v: string) => void;
          }[];

          return (
            <div
              style={{
                padding: "4px 2px 14px",
                fontFamily: F,
                fontSize: 11,
                color: "#000",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <style>{`
                @media (max-width: 600px) {
                  .w98c-row1, .w98c-row3 { grid-template-columns: 1fr !important; }
                  .w98c-row2-inner { grid-template-columns: 1fr !important; }
                  .w98c-global { flex-direction: column !important; align-items: flex-start !important; }
                }
              `}</style>

              {contactTranslateError && (
                <div
                  style={{
                    fontFamily: F,
                    fontSize: 11,
                    color: "#cc0000",
                    border: "2px solid #cc0000",
                    padding: "4px 8px",
                    background: "#fff0f0",
                  }}
                >
                  {contactTranslateError}
                </div>
              )}
              {contactTranslationPending && (
                <div
                  style={{
                    fontFamily: F,
                    fontSize: 11,
                    color: "#555",
                    border: "2px solid #808080",
                    padding: "4px 8px",
                    background: "#fffff0",
                  }}
                >
                  Translating to all 18 languages… This tab will auto-refresh
                  when done.
                </div>
              )}

              {/* ══ Row 1: Section Heading | Contact Details ══ */}
              <div
                className="w98c-row1"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  alignItems: "stretch",
                }}
              >
                {/* Section Heading */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Section Heading</span>
                  <span style={LBL}>Title</span>
                  <input
                    type="text"
                    value={contactTitle}
                    onChange={(e) => setContactTitle(e.target.value)}
                    placeholder="Contact us"
                    style={{ ...INPUT, marginBottom: 6 }}
                  />
                  <span style={LBL}>Subtitle</span>
                  <textarea
                    value={contactSubtitle}
                    onChange={(e) => setContactSubtitle(e.target.value)}
                    rows={2}
                    placeholder="We're here to help"
                    style={{ ...TEXTAREA, marginBottom: 8 }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistContact(
                          buildContactSource(),
                          "contactHeading",
                        )
                      }
                      disabled={contactTranslating}
                    >
                      {contactSectionSaved.contactHeading ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setContactTitle("");
                        setContactSubtitle("");
                        void persistContact(
                          { ...buildContactSource(), title: "", subtitle: "" },
                          "contactHeading",
                        );
                      }}
                      disabled={contactTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Contact Details */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Contact Details</span>
                  <span style={{ ...LBL, color: "#808080", marginBottom: 6 }}>
                    These values are used directly — not translated.
                  </span>
                  <span style={LBL}>
                    WhatsApp number (digits only, e.g. 31685352412)
                  </span>
                  <input
                    type="text"
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value)}
                    placeholder="31685352412"
                    style={{ ...INPUT, marginBottom: 6 }}
                  />
                  <span style={LBL}>Email address</span>
                  <input
                    type="text"
                    value={contactEmailAddress}
                    onChange={(e) => setContactEmailAddress(e.target.value)}
                    placeholder="info@teamcargo.nl"
                    style={{ ...INPUT, marginBottom: 6 }}
                  />
                  <span style={LBL}>Address (shown in contact row)</span>
                  <input
                    type="text"
                    value={contactMapAddress}
                    onChange={(e) => setContactMapAddress(e.target.value)}
                    placeholder="Poortland 146, 1046 BD Amsterdam"
                    style={{ ...INPUT, marginBottom: 8 }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistContact(
                          buildContactSource(),
                          "contactDetails",
                        )
                      }
                      disabled={contactTranslating}
                    >
                      {contactSectionSaved.contactDetails ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setContactWhatsapp("");
                        setContactEmailAddress("");
                        setContactMapAddress("");
                        void persistContact(
                          {
                            ...buildContactSource(),
                            whatsapp_number: "",
                            email_address: "",
                            map_address: "",
                          },
                          "contactDetails",
                        );
                      }}
                      disabled={contactTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* ══ Row 2: Row Labels & Icons ══ */}
              <div style={{ ...GRP }}>
                <span style={GRP_LBL}>Row Labels &amp; Icons</span>
                <div
                  className="w98c-row2-inner"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  {contactRowDefs.map(
                    ({ key, label, placeholder, value, setter }, i) => {
                      const isPickerOpen = contactIconPicker === i;
                      return (
                        <div
                          key={key}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          <span style={LBL}>{label}</span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <div
                              style={{ position: "relative", flexShrink: 0 }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setContactIconPicker(isPickerOpen ? null : i)
                                }
                                style={{
                                  ...BTN,
                                  minWidth: 0,
                                  padding: "2px 8px",
                                }}
                                title="Pick icon"
                              >
                                <span style={{ fontSize: 10 }}>Ico</span>
                              </button>
                              {isPickerOpen && (
                                <div
                                  data-iconpicker
                                  style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    marginTop: 2,
                                    zIndex: 50,
                                    width: 176,
                                    background: "#c0c0c0",
                                    border: "2px solid",
                                    borderColor: "#fff #808080 #808080 #fff",
                                    padding: 6,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      marginBottom: 4,
                                    }}
                                  >
                                    <span
                                      style={{ fontSize: 10, color: "#555" }}
                                    >
                                      Choose icon
                                    </span>
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 2,
                                        alignItems: "center",
                                      }}
                                    >
                                      <button
                                        type="button"
                                        disabled={contactIconPages[i] === 0}
                                        onClick={() =>
                                          setContactIconPages((prev) => {
                                            const next = [...prev];
                                            next[i] = Math.max(0, next[i] - 1);
                                            return next;
                                          })
                                        }
                                        style={{
                                          ...BTN,
                                          minWidth: 0,
                                          padding: "0 5px",
                                        }}
                                      >
                                        ‹
                                      </button>
                                      <span
                                        style={{
                                          fontSize: 10,
                                          color: "#555",
                                          width: 30,
                                          textAlign: "center" as const,
                                        }}
                                      >
                                        {contactIconPages[i] + 1}/
                                        {CONTACT_ICON_OPTS.length}
                                      </span>
                                      <button
                                        type="button"
                                        disabled={
                                          contactIconPages[i] >=
                                          CONTACT_ICON_OPTS.length - 1
                                        }
                                        onClick={() =>
                                          setContactIconPages((prev) => {
                                            const next = [...prev];
                                            next[i] = Math.min(
                                              CONTACT_ICON_OPTS.length - 1,
                                              next[i] + 1,
                                            );
                                            return next;
                                          })
                                        }
                                        style={{
                                          ...BTN,
                                          minWidth: 0,
                                          padding: "0 5px",
                                        }}
                                      >
                                        ›
                                      </button>
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "repeat(5, 1fr)",
                                      gap: 2,
                                    }}
                                  >
                                    {CONTACT_ICON_OPTS[contactIconPages[i]].map(
                                      ({ id, Icon: Ic, label: optLabel }) => (
                                        <button
                                          key={id}
                                          type="button"
                                          title={optLabel}
                                          onClick={() => {
                                            setContactRowIcons((prev) => {
                                              const next = [...prev];
                                              next[i] = id;
                                              return next;
                                            });
                                            setContactIconPicker(null);
                                          }}
                                          style={{
                                            ...BTN,
                                            minWidth: 0,
                                            padding: "3px",
                                            background:
                                              contactRowIcons[i] === id
                                                ? "#d0d0d0"
                                                : "#c0c0c0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <Ic
                                            style={{
                                              width: 12,
                                              height: 12,
                                              display: "block",
                                            }}
                                          />
                                        </button>
                                      ),
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setContactRowIcons((prev) => {
                                        const next = [...prev];
                                        next[i] = "";
                                        return next;
                                      });
                                      setContactIconPicker(null);
                                    }}
                                    style={{
                                      ...BTN,
                                      width: "100%",
                                      marginTop: 4,
                                      fontSize: 10,
                                    }}
                                  >
                                    Reset icon
                                  </button>
                                </div>
                              )}
                            </div>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => setter(e.target.value)}
                              placeholder={placeholder}
                              style={{ ...INPUT, flex: 1 }}
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
                <div style={{ ...HR }} />
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    style={BTN}
                    onClick={() =>
                      void persistContact(buildContactSource(), "contactLabels")
                    }
                    disabled={contactTranslating}
                  >
                    {contactSectionSaved.contactLabels ? "Saved ✓" : "Save"}
                  </button>
                  <button
                    style={BTN}
                    onClick={() => {
                      setContactPhoneLabel("");
                      setContactEmailLabel("");
                      setContactAddressLabel("");
                      setContactRowIcons(["", "", ""]);
                      void persistContact(
                        {
                          ...buildContactSource(),
                          phone: "",
                          email: "",
                          address: "",
                          phoneIcon: "",
                          emailIcon: "",
                          addressIcon: "",
                        },
                        "contactLabels",
                      );
                    }}
                    disabled={contactTranslating}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* ══ Row 3: Map Pin | Background Image ══ */}
              <div
                className="w98c-row3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  alignItems: "stretch",
                }}
              >
                {/* Map Pin */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Map Pin Location</span>
                  <span style={{ ...LBL, color: "#808080", marginBottom: 6 }}>
                    Leave empty to use the address from Contact Details above.
                  </span>
                  <span style={LBL}>
                    Map search query (address or coordinates)
                  </span>
                  <input
                    type="text"
                    value={contactMapPin}
                    onChange={(e) => setContactMapPin(e.target.value)}
                    placeholder="Poortland 146, 1046 BD Amsterdam"
                    style={{ ...INPUT, marginBottom: 8 }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistContact(
                          buildContactSource(),
                          "contactMapPin",
                        )
                      }
                      disabled={contactTranslating}
                    >
                      {contactSectionSaved.contactMapPin ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setContactMapPin("");
                        void persistContact(
                          { ...buildContactSource(), map_pin: "" },
                          "contactMapPin",
                        );
                      }}
                      disabled={contactTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Background / Side Image */}
                <div
                  style={{ ...GRP, display: "flex", flexDirection: "column" }}
                >
                  <span style={GRP_LBL}>Background / Side Image</span>
                  <CloudinaryLogoUpload
                    value={contactImg || "/images/office_webP.webp"}
                    onChange={(url) => setContactImg(url)}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <button
                      style={BTN}
                      onClick={() =>
                        void persistContact(buildContactSource(), "contactImg")
                      }
                      disabled={contactTranslating}
                    >
                      {contactSectionSaved.contactImg ? "Saved ✓" : "Save"}
                    </button>
                    <button
                      style={BTN}
                      onClick={() => {
                        setContactImg("");
                        void persistContact(
                          { ...buildContactSource(), img: "" },
                          "contactImg",
                        );
                      }}
                      disabled={contactTranslating}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* ══ Global Actions ══ */}
              <div
                className="w98c-global"
                style={{
                  ...GRP,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flexWrap: "wrap" as const,
                }}
              >
                <span style={GRP_LBL}>Global Actions</span>
                <span style={{ fontFamily: F, fontSize: 11 }}>
                  Save all contact changes &amp; translate to 18 languages
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => void saveAllContact()}
                    disabled={contactSavingAll || contactTranslating}
                    style={BTN_LG}
                  >
                    {contactAllSaved ? "All Saved ✓" : "Save All"}
                  </button>
                  <button
                    onClick={() => void resetAllContact()}
                    disabled={contactSavingAll || contactTranslating}
                    style={{ ...BTN_LG, color: "#cc0000" }}
                  >
                    Restore All Defaults
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {!win98 && (
        <div className="space-y-4">
          {contactTranslateError && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
              {contactTranslateError}
            </p>
          )}
          {contactTranslationPending && (
            <div className="flex items-center gap-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 px-4 py-3 text-xs text-amber-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              Translating to all 18 languages in the background… This tab will
              auto-refresh when done.
            </div>
          )}

          {/* Section Heading */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Section Heading
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Title</p>
                <input
                  type="text"
                  value={contactTitle}
                  onChange={(e) => setContactTitle(e.target.value)}
                  placeholder="Contact Us"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Subtitle</p>
                <input
                  type="text"
                  value={contactSubtitle}
                  onChange={(e) => setContactSubtitle(e.target.value)}
                  placeholder="Get in touch"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Row Labels */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Row Labels
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Phone label</p>
                <input
                  type="text"
                  value={contactPhoneLabel}
                  onChange={(e) => setContactPhoneLabel(e.target.value)}
                  placeholder="Phone"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Email label</p>
                <input
                  type="text"
                  value={contactEmailLabel}
                  onChange={(e) => setContactEmailLabel(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Address label</p>
                <input
                  type="text"
                  value={contactAddressLabel}
                  onChange={(e) => setContactAddressLabel(e.target.value)}
                  placeholder="Address"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Contact Details
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Phone / WhatsApp</p>
                <input
                  type="text"
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  placeholder="+31 6 00000000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Email address</p>
                <input
                  type="text"
                  value={contactEmailAddress}
                  onChange={(e) => setContactEmailAddress(e.target.value)}
                  placeholder="info@teamcargo.nl"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Map address</p>
                <input
                  type="text"
                  value={contactMapAddress}
                  onChange={(e) => setContactMapAddress(e.target.value)}
                  placeholder="Amsterdam, Netherlands"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Map pin label</p>
                <input
                  type="text"
                  value={contactMapPin}
                  onChange={(e) => setContactMapPin(e.target.value)}
                  placeholder="Our Location"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Side Image */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Background / Side Image
            </p>
            {contactImg && (
              <Image
                src={contactImg}
                alt=""
                width={400}
                height={128}
                className="w-full h-32 object-cover rounded-lg"
                style={{ width: "100%", height: "auto" }}
              />
            )}
            <CloudinaryLogoUpload value={contactImg} onChange={setContactImg} />
          </div>

          {/* Global Actions */}
          <div className="rounded-2xl bg-amber-400/5 border border-amber-400/10 p-5 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-400">
              Save all changes &amp; translate to 18 languages
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => void saveAllContact()}
                disabled={contactSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-300 disabled:opacity-60 transition-colors"
              >
                {contactSavingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : contactAllSaved ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {contactAllSaved ? "All Saved ✓" : "Save All"}
              </button>
              <button
                onClick={() => void resetAllContact()}
                disabled={contactSavingAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-800/50 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 disabled:opacity-60 transition-colors"
              >
                Restore All Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
