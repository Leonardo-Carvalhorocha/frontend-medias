function Footer() {
  return (
    // <footer className="w-full py-4 text-center text-sm text-gray-600 border-t mt-8">
    //   <span>
    //     Desenvolvido por Leonardo Carvalho juntamente com Alexia Sarah Baltazar. Versão 1.0.0 
    //   </span>
    // </footer>
    <footer className="w-full py-4 mt-8 border-t text-center text-sm text-gray-600">
      Desenvolvido por Leonardo Carvalho juntamente com Alexia Sarah Baltazar.{' '}
      Versão {__APP_VERSION__}
    </footer>
  );
}

export default Footer;
