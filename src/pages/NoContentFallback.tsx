export function NoContentFallback() {
    return (
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">No content available at the moment.</p>
            <p className="text-sm mt-2">Check back later for new videos and blogs!</p>
          </div>
        </div>
      </section>
    );
  }