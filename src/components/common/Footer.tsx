import GitHubIcon from "@components/icons/GitHubIcon";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-6 my-14 font-light">
      <div className="border-t-1 border-gray-light"></div>
      <p className="text-center text-gray m-auto max-w-[500px]">
        Bookify es una plataforma creada por y para estudiantes, pensada para
        facilitar el acceso al conocimiento académico.
      </p>
      <a
        href="https://github.com/Mauriciocr207/Bookify"
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-2 justify-center items-center"
      >
        <GitHubIcon />
        <p>Colabora</p>
      </a>
    </footer>
  );
}