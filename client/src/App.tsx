import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Upload from "@/pages/Upload";
import Library from "@/pages/Library";
import Settings from "@/pages/Settings";
// import NotFound from "@/pages/not-found";
import Features from "@/pages/Features";
import TextTranslate from "@/pages/TextTranslate";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading ? (
        <Route path="/" component={Landing} />
      ) : !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
        </>
      ) : (
        <>
          <Route path="/login" component={() => <Redirect to="/features" />} />
          <Route path="/" component={() => <Redirect to="/features" />} />
          <Route path="/features" component={Features} />
          <Route path="/home" component={Home} />
          <Route path="/upload" component={Upload} />
          <Route path="/text-translate" component={TextTranslate} />
          <Route path="/library" component={Library} />
          <Route path="/settings" component={Settings} />
        </>
      )}
      {/* <Route component={NotFound} /> */}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
