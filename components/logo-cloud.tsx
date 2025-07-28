import { HTMLAttributes } from "react";
import { Users, Code, Calendar, Trophy } from "lucide-react";

function LogoCloud(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <p className="text-center text-muted-foreground mb-8">Join the community that's shaping the future</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {/* Active Members */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold">500+</div>
          <div className="text-sm text-muted-foreground">Active Members</div>
        </div>

        {/* Projects Completed */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            <Code className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold">150+</div>
          <div className="text-sm text-muted-foreground">Projects Built</div>
        </div>

        {/* Events Hosted */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold">75+</div>
          <div className="text-sm text-muted-foreground">Events Hosted</div>
        </div>

        {/* Awards Won */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold">25+</div>
          <div className="text-sm text-muted-foreground">Awards Won</div>
        </div>
      </div>

      {/* Focus Areas */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground mb-4">Our Focus Areas</p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">Web Development</span>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">Mobile Apps</span>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">AI & Machine Learning</span>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">Cybersecurity</span>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">Data Science</span>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">Cloud Computing</span>
        </div>
      </div>
    </div>
  );
}

export default LogoCloud;
