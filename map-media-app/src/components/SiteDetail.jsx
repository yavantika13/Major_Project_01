import { useEffect, useState } from "react";
import { resolveMedia } from "../services/firebase.js";

function useMedia(path) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let alive = true;
    setUrl(null);

    if (!path) return () => {
      alive = false;
    };

    resolveMedia(path)
      .then((result) => {
        if (alive) setUrl(result || null);
      })
      .catch(() => {
        if (alive) setUrl(null);
      });

    return () => {
      alive = false;
    };
  }, [path]);

  return url;
}

export default function SiteDetail({ site, distance, onClose }) {
  const imageUrl = useMedia(site.image);
  const audioUrl = useMedia(site.audio);
  const hindiAudioUrl = useMedia(site.audioHi);

  const [imageFailed, setImageFailed] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const [hindiAudioFailed, setHindiAudioFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
    setAudioFailed(false);
    setHindiAudioFailed(false);
  }, [site.id, imageUrl, audioUrl, hindiAudioUrl]);

  const directions = `https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`;

  return (
    <article className="detail" aria-label={site.name}>
      <button
        className="detail-close"
        onClick={onClose}
        aria-label="Band karo"
      >
        ×
      </button>

      {imageUrl && !imageFailed ? (
        <img
          className="detail-img"
          src={imageUrl}
          alt={site.name}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="detail-img placeholder" aria-hidden="true">
          <span>{site.name?.charAt(0) || "H"}</span>
        </div>
      )}

      <div className="detail-body">
        <h2>{site.name}</h2>

        <p className="meta">
          {site.state}
          {site.category && (
            <> · <span className="chip">{site.category}</span></>
          )}
          {distance != null && <> · {Math.round(distance)} km door</>}
        </p>

        {site.description && <p>{site.description}</p>}

        <h3>Audio Guide</h3>

        {audioUrl && !audioFailed ? (
          <div>
            <p>English Guide</p>
            <audio
              controls
              preload="none"
              src={audioUrl}
              onError={() => setAudioFailed(true)}
            />
          </div>
        ) : (
          <p className="muted">English audio guide abhi available nahi hai.</p>
        )}

        {hindiAudioUrl && !hindiAudioFailed ? (
          <div>
            <p>Hindi Guide</p>
            <audio
              controls
              preload="none"
              src={hindiAudioUrl}
              onError={() => setHindiAudioFailed(true)}
            />
          </div>
        ) : (
          <p className="muted">Hindi audio guide abhi available nahi hai.</p>
        )}

        <a
          className="btn"
          href={directions}
          target="_blank"
          rel="noreferrer"
        >
          Get Directions
        </a>
      </div>
    </article>
  );
}