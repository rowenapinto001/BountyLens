export default function LogoMark() {
  const iconUrl =
    typeof chrome !== "undefined" && chrome.runtime?.getURL
      ? chrome.runtime.getURL("icons/icon-32.png")
      : "/icons/icon-32.png";

  return (
    <span className="logo-mark" aria-hidden="true">
      <img src={iconUrl} alt="" />
    </span>
  );
}
