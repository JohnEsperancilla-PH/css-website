import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface UpdateLog {
  version: string;
  information: string;
  date: string;
  sha: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
}

async function getGitHubCommits(): Promise<UpdateLog[]> {
  try {
    // GitHub repository details
    const owner = 'JohnEsperancilla-PH';
    const repo = 'css-website';
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=20`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Add token if needed for higher rate limits
          // 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        next: { revalidate: 3600 } // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch commits');
    }

    const commits: GitHubCommit[] = await response.json();
    
    return commits.map((commit: GitHubCommit, index: number) => ({
      version: `v1.0.${commits.length - index}`,
      information: commit.commit.message.split('\n')[0], // First line of commit message
      date: new Date(commit.commit.author.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      sha: commit.sha.substring(0, 7)
    }));
  } catch (error) {
    console.error('Error fetching commits:', error);
    // Return mock data as fallback
    return [
      {
        version: 'v1.0.3',
        information: 'Added update logs functionality',
        date: 'Jan 15, 2024',
        sha: 'abc123f'
      },
      {
        version: 'v1.0.2', 
        information: 'Improved footer design and added chatbot',
        date: 'Jan 10, 2024',
        sha: 'def456a'
      },
      {
        version: 'v1.0.1',
        information: 'Initial website launch with core features',
        date: 'Jan 5, 2024', 
        sha: 'ghi789b'
      }
    ];
  }
}

export default async function UpdateLogsPage() {
  const updates = await getGitHubCommits();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-6 xl:px-0 pt-36 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Update Logs</h1>
          <p className="text-muted-foreground text-lg">
            Track the latest changes and improvements to the CSS website
          </p>
        </div>

        <div className="bg-card border rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] px-6 py-4">Update Version</TableHead>
                <TableHead className="px-6 py-4">Information</TableHead>
                <TableHead className="w-[120px] px-6 py-4">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {updates.map((update) => (
                <TableRow key={update.sha}>
                  <TableCell className="font-medium px-6 py-4">
                    {update.version}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="max-w-md leading-relaxed">
                      {update.information}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground px-6 py-4">
                    {update.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 text-sm text-muted-foreground">
          <p>Updates are automatically fetched from our GitHub repository commits.</p>
        </div>
      </div>
    </div>
  );
}
