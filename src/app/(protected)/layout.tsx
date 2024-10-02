type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-slate-300">
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
