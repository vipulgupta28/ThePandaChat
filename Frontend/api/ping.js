export default async function handler(req, res) {
  const urls = [
    "https://lawyerdup.onrender.com/api/health",
    "https://thepandachat.onrender.com/health",
    "https://drawit-2.onrender.com/health"
  ];

  await Promise.all(
    urls.map(url =>
      fetch(url).catch(() => null)
    )
  );

  res.status(200).json({ message: "Pinged all services" });
}
