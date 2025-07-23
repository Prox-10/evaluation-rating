// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-hris-green">CFARBEMPCO HRIS</h1>
        <p className="text-xl text-muted-foreground mb-6">Human Resource Information System</p>
        <a 
          href="/evaluation" 
          className="inline-flex items-center px-6 py-3 bg-hris-green text-white rounded-lg hover:bg-hris-green-dark transition-colors"
        >
          Go to Employee Evaluation
        </a>
      </div>
    </div>
  );
};

export default Index;
