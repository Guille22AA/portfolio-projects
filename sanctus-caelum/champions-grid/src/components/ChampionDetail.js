import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { championsData } from "../data/championsData";
import { galleryBySlug } from "../data/galleryData";
import vocabulary from "../data/vocabulary.json";
import {
  MAX_LEVEL,
  formatBonusAttackSpeed,
  formatScaling,
  humanize,
  parseFormula
} from "../utils/championStats";
import Icon from "./Icons";
import RatingWheel from "./RatingWheel";
import AbilityList, { PassiveList, getPassives } from "./AbilityList";
import "../styles/ChampionDetail.css";

// currency names live here so they can be renamed without touching the champion files
const CURRENCIES = { coins: "Aurei", premium: "Astral Shards" };
const DIFFICULTY_LEVEL = { Easy: 1, Medium: 2, Hard: 3 };
const LEVELS = Array.from({ length: MAX_LEVEL }, (_, index) => index + 1);

const asList = (value) => [].concat(value || []);

// an interaction can be "quote", [type, quote], [[types], quote] or a list of any of those
const readInteraction = (value) => {
  if (typeof value === "string") return [{ types: [], text: value }];
  if (Array.isArray(value) && value.length === 2 && typeof value[1] === "string") {
    const types = asList(value[0]);
    if (types.every((type) => type === "ally" || type === "enemy")) {
      return [{ types, text: value[1] }];
    }
  }
  return asList(value).flatMap(readInteraction);
};

// "android17" -> "Android 17", "phantom-troupe" -> "Phantom Troupe"
const nameFromSlug = (slug) =>
  slug
    .split("-")
    .map((word) => word.replace(/([a-z])(\d)/i, "$1 $2").replace(/^./, (c) => c.toUpperCase()))
    .join(" ");

// interactions are keyed by the target's file name: once that champion exists, the link appears by itself
const getInteractions = (champion) =>
  Object.entries(champion.quotes?.interactions || {}).map(([key, value]) => {
    const target = championsData.find((other) => other.slug === key);
    return {
      key,
      target,
      name: target ? target.nick : nameFromSlug(key),
      quotes: readInteraction(value)
    };
  });

// a tall, thin chevron drawn as two strokes, with a small diamond at its tip
const PagerChevron = ({ direction }) => {
  const prev = direction === "prev";
  return (
    <svg viewBox="0 0 26 90" aria-hidden="true">
      <path
        d={prev ? "M22 2 L5 45 L22 88" : "M4 2 L21 45 L4 88"}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={prev ? "M5 39.5 L-0.5 45 L5 50.5 L10.5 45 Z" : "M21 39.5 L26.5 45 L21 50.5 L15.5 45 Z"} fill="currentColor" />
    </svg>
  );
};

const SectionTitle = ({ icon, children }) => (
  <div className="cd-section-title">
    <span className="cd-section-line left"></span>
    <Icon name={icon} size={18} />
    <h2>{children}</h2>
    <span className="cd-section-line right"></span>
  </div>
);

const StatCell = ({ icon, label, value }) => (
  <div className="cd-stat">
    <span className="cd-stat-label" title={label}>
      {icon && <Icon name={icon} size={14} />}
      <span className="cd-stat-text">{label}</span>
    </span>
    <span className="cd-stat-value">{value}</span>
  </div>
);

const StatsTable = ({ stats, resource, level, onLevelChange }) => {
  const hasResource = resource && resource.type !== "None";
  const resourceMax =
    hasResource && resource.maxValue !== undefined
      ? formatScaling({ base: resource.maxValue, growth: resource.maxValueGrowth || 0 }, level)
      : "—";
  // some resources describe their regen with text and keep the numeric formula in "passiveRegen"
  const regenSource = [resource?.regen, resource?.passiveRegen].find((value) => parseFormula(value));
  const resourceRegen = hasResource
    ? formatScaling(regenSource || resource.regen || resource.generation, level)
    : "—";
  const attackSpeed = stats.attackSpeed || {};

  return (
    <section className="cd-stats">
      <header className="cd-stats-header">
        <label>
          Level:
          <select value={level || ""} onChange={(event) => onLevelChange(Number(event.target.value) || null)}>
            <option value="">1-{MAX_LEVEL}</option>
            {LEVELS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <span>Base statistics</span>
      </header>

      <div className="cd-stats-grid">
        <StatCell icon="health" label="HP" value={formatScaling(stats.health, level)} />
        <StatCell icon="resource" label={hasResource ? resource.name : "Resource"} value={resourceMax} />
        <StatCell icon="health" label="HP5" value={formatScaling(stats.healthRegen, level)} />
        <StatCell icon="resource" label="Regen" value={resourceRegen} />
        <StatCell icon="toughness" label="AR" value={formatScaling(stats.armor, level)} />
        <StatCell icon="damage" label="AD" value={formatScaling(stats.attackDamage, level)} />
        <StatCell icon="magicResist" label="MR" value={formatScaling(stats.magicResistance, level)} />
        <StatCell icon="crit" label="Crit. DMG" value={stats.criticalDamage} />
        <StatCell icon="mobility" label="MS" value={stats.movementSpeed} />
        <StatCell icon="range" label="Attack range" value={stats.attackRange} />
      </div>

      <header className="cd-stats-header cd-stats-subheader">
        <span><Icon name="attackSpeed" size={14} /> Attack speed</span>
      </header>

      <div className="cd-stats-grid">
        <StatCell label="Base AS" value={attackSpeed.base} />
        <StatCell label="Windup%" value={attackSpeed.windup} />
        {/* champions without their own ratio scale with their base attack speed, as in LoL */}
        <StatCell label="AS ratio" value={attackSpeed.asRatio || attackSpeed.base} />
        <StatCell label="Bonus AS" value={formatBonusAttackSpeed(attackSpeed.bonusAS, level)} />
        {stats.missileSpeed && <StatCell label="Missile speed" value={stats.missileSpeed} />}
      </div>
    </section>
  );
};

const Gallery = ({ images, name }) => {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight") setOpen((index) => (index + 1) % images.length);
      if (event.key === "ArrowLeft") setOpen((index) => (index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  const step = (event, direction) => {
    event.stopPropagation();
    setOpen((index) => (index + direction + images.length) % images.length);
  };

  return (
    <section className="cd-section">
      <SectionTitle icon="brush">Art gallery</SectionTitle>
      <div className="cd-gallery">
        {images.map((image, index) => (
          <button className="cd-gallery-item" key={image} onClick={() => setOpen(index)}>
            <img src={image} alt={`${name} artwork ${index + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {open !== null && (
        <div className="cd-lightbox" onClick={() => setOpen(null)}>
          <button className="cd-lightbox-btn close" aria-label="Close" onClick={() => setOpen(null)}>
            <Icon name="close" size={22} />
          </button>
          {images.length > 1 && (
            <button className="cd-lightbox-btn prev" aria-label="Previous" onClick={(event) => step(event, -1)}>
              <Icon name="chevronLeft" size={26} />
            </button>
          )}
          <img src={images[open]} alt={`${name} artwork ${open + 1}`} onClick={(event) => event.stopPropagation()} />
          {images.length > 1 && (
            <button className="cd-lightbox-btn next" aria-label="Next" onClick={(event) => step(event, 1)}>
              <Icon name="chevronRight" size={26} />
            </button>
          )}
        </div>
      )}
    </section>
  );
};

const ChampionView = ({ champion }) => {
  // null level means "show the whole 1-20 range"
  const [level, setLevel] = useState(null);
  const forms = champion.forms ? Object.entries(champion.forms) : [];
  const [formKey, setFormKey] = useState(forms.length ? forms[0][0] : null);

  // champions with forms keep stats and abilities inside each form, plus the abilities they share
  const form = formKey ? champion.forms[formKey] : null;
  const stats = form ? form.stats : champion.stats;
  const abilities = form ? { ...form.abilities, ...champion.sharedAbilities } : champion.abilities;

  const passives = abilities ? getPassives(abilities) : [];
  const interactions = getInteractions(champion);
  const gallery = galleryBySlug[champion.slug] || [];
  // previous / next follow the grid order and wrap around at both ends
  const position = championsData.findIndex((other) => other.slug === champion.slug);
  const previous = championsData[(position - 1 + championsData.length) % championsData.length];
  const next = championsData[(position + 1) % championsData.length];
  const sameAnime = championsData.filter(
    (other) => other.anime === champion.anime && other.slug !== champion.slug
  );
  const difficulty = DIFFICULTY_LEVEL[champion.difficulty] || 0;

  const info = [
    ["Release date", champion.releaseDate],
    ["Last changed", champion.lastChanged],
    ["Anime", champion.anime],
    ["Class", asList(champion.class).join(" / ")],
    ["Affiliation", champion.affiliation],
    ["Resource", champion.resource?.type !== "None" && champion.resource?.name],
    ["Range type", asList(champion.attackTypes).join(" / ")],
    ["Adaptive type", asList(champion.damageTypes).join(" / ")]
  ].filter(([, value]) => value);

  return (
    <main className="champion-detail">
      {/* big arrows on both sides of the page, at the height where the page opens */}
      <nav aria-label="Browse champions">
        <Link
          className="cd-pager-arrow prev"
          to={`/champion/${previous.slug}`}
          aria-label={`Previous champion: ${previous.fullName}`}
          title={previous.fullName}
        >
          <PagerChevron direction="prev" />
        </Link>
        <Link
          className="cd-pager-arrow next"
          to={`/champion/${next.slug}`}
          aria-label={`Next champion: ${next.fullName}`}
          title={next.fullName}
        >
          <PagerChevron direction="next" />
        </Link>
      </nav>

      <div className="cd-top">
        <section className="cd-hero">
          <div className="cd-hero-backdrop" style={{ backgroundImage: `url(${champion.render})` }}></div>

          <div className="cd-hero-info">
            <div className="cd-hero-heading">
              <h1>{champion.fullName}</h1>
              <p>{champion.alias}</p>
            </div>

            <div className="cd-hero-summary">
              <div className="cd-hero-fields">
                <div className="cd-field">
                  <span className="cd-field-label">Tag(s):</span>
                  <div className="cd-tags">
                    {asList(champion.tags).map((tag) => (
                      <span className="cd-tag" key={tag}>{vocabulary.tags[tag] || humanize(tag)}</span>
                    ))}
                  </div>
                </div>

                <div className="cd-field">
                  <span className="cd-field-label">Role(s):</span>
                  <div className="cd-roles">
                    {asList(champion.roles).map((role) => (
                      <span className="cd-role" key={role}><Icon name={role} size={16} /> {role}</span>
                    ))}
                  </div>
                </div>

                {champion.price && (
                  <div className="cd-field">
                    <span className="cd-field-label">Store price:</span>
                    <div className="cd-price">
                      <span title={CURRENCIES.coins}>
                        <Icon name="coin" size={16} title={CURRENCIES.coins} /> {champion.price.coins}
                      </span>
                      <span className="cd-price-divider">|</span>
                      <span title={CURRENCIES.premium}>
                        <Icon name="shard" size={16} title={CURRENCIES.premium} /> {champion.price.premium}
                      </span>
                    </div>
                  </div>
                )}

                {champion.style !== undefined && (
                  <div className="cd-field">
                    <span className="cd-field-label">Style:</span>
                    <div className="cd-style" title={`Basic attacks ${100 - champion.style}% · Abilities ${champion.style}%`}>
                      <Icon name="damage" size={15} />
                      <span className="cd-style-track">
                        <span className="cd-style-dot" style={{ left: `${champion.style}%` }}></span>
                      </span>
                      <Icon name="utility" size={15} />
                    </div>
                  </div>
                )}

                <div className="cd-field">
                  <span className="cd-field-label">Difficulty:</span>
                  <div className="cd-difficulty" title={champion.difficulty}>
                    {[1, 2, 3].map((bar) => (
                      <span key={bar} className={bar <= difficulty ? "on" : ""}></span>
                    ))}
                  </div>
                </div>
              </div>

              {champion.ratings && <RatingWheel ratings={champion.ratings} />}
            </div>

            <dl className="cd-info">
              {info.map(([label, value]) => (
                <div className="cd-info-row" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="cd-hero-figure">
            <img src={`/cutouts/${champion.slug}.webp`} alt={champion.fullName} />
          </div>
        </section>

        <aside className="cd-side">
          {forms.length > 0 && (
            <div className="cd-forms">
              {forms.map(([key, value]) => (
                <button
                  key={key}
                  className={key === formKey ? "active" : ""}
                  onClick={() => setFormKey(key)}
                  title={value.description}
                >
                  {value.displayName || humanize(key)}
                </button>
              ))}
            </div>
          )}

          {stats && (
            <StatsTable stats={stats} resource={champion.resource} level={level} onLevelChange={setLevel} />
          )}

          <section className="cd-box">
            <h2 className="cd-box-title">Quotes</h2>
            <div className="cd-box-body">
              {champion.quotes?.selection && (
                <p className="cd-quote cd-quote-main">{champion.quotes.selection}</p>
              )}
              {asList(champion.quotes?.general).map((quote) => (
                <p className="cd-quote" key={quote}>{quote}</p>
              ))}
            </div>
          </section>

          {interactions.length > 0 && (
            <section className="cd-box">
              <h2 className="cd-box-title">Interactive quotes</h2>
              <div className="cd-box-body">
                {interactions.map((interaction) => (
                  <div className="cd-interaction" key={interaction.key}>
                    <span className="cd-interaction-target">
                      {interaction.target ? (
                        <Link to={`/champion/${interaction.target.slug}`}>{interaction.name}</Link>
                      ) : (
                        interaction.name
                      )}
                    </span>
                    {interaction.quotes.map((quote) => (
                      <p className="cd-quote" key={quote.text}>
                        {quote.types.map((type) => (
                          <span className={`cd-relation ${type}`} key={type}>{type}</span>
                        ))}
                        {quote.text}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      {champion.lore && (
        <section className="cd-section cd-lore">
          <SectionTitle icon="scroll">Lore</SectionTitle>
          {champion.lore.split(/\n+/).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      )}

      {form && (
        <p className="cd-form-note cd-form-banner">{form.displayName}: {form.description}</p>
      )}

      {passives.length > 0 && (
        <section className="cd-section">
          <SectionTitle icon="aura">{passives.length > 1 ? "Passives" : "Passive"}</SectionTitle>
          <PassiveList abilities={abilities} />
        </section>
      )}

      {abilities && (
        <section className="cd-section">
          <SectionTitle icon="utility">Abilities</SectionTitle>
          <AbilityList abilities={abilities} />
        </section>
      )}

      {gallery.length > 0 && <Gallery images={gallery} name={champion.fullName} />}

      {sameAnime.length > 0 && (
        <section className="cd-section">
          <SectionTitle icon="compass">Explore champions</SectionTitle>
          <div className="cd-explore">
            {sameAnime.map((other) => (
              <Link className="cd-explore-card" to={`/champion/${other.slug}`} key={other.slug}>
                <div className="cd-explore-image">
                  <img src={other.render} alt={other.fullName} loading="lazy" />
                </div>
                <div className="cd-explore-meta">
                  <h3>{other.fullName}</h3>
                  <p>{other.affiliation}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

const ChampionDetail = () => {
  const { slug } = useParams();
  const champion = championsData.find((item) => item.slug === slug);

  // each champion page starts at the top, also when jumping from one champion to another
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // the browser tab shows which champion is open
  useEffect(() => {
    if (!champion) return undefined;
    const previous = document.title;
    document.title = `${champion.fullName} | Sanctus Caelum`;
    return () => {
      document.title = previous;
    };
  }, [champion]);

  if (!champion) {
    return (
      <main className="champion-detail cd-missing">
        <p>Champion not found.</p>
        <Link to="/">Back to champions</Link>
      </main>
    );
  }

  // the key resets level and form selection when moving to another champion
  return <ChampionView key={champion.slug} champion={champion} />;
};

export default ChampionDetail;
