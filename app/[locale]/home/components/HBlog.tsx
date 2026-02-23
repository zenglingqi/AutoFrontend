const blogPosts = [
    {
        id: 1,
        title: 'How to Prep Your Skin Before Makeup',
        date: 'December 15, 2025',
        author: 'John Walter',
        category: 'Beauty Trend',
        excerpt: 'Explore the fundamental techniques and indispensable tools needed for thriving in beekeeping. Learn how to',
        image: 'https://ext.same-assets.com/1832031263/1277681081.png',
        featured: true,
    },
    {
        id: 2,
        title: 'Simple Beauty Hacks for a Radiant Look',
        date: 'December 15, 2025',
        author: 'John Walter',
        category: 'Beauty Trend',
        excerpt: 'Explore the fundamental techniques and indispensable tools needed for thriving in beekeeping. Learn how to',
        image: 'https://ext.same-assets.com/1832031263/2597386303.png',
    },
    {
        id: 3,
        title: 'Celebrity Beauty Trends You Can Try at Home',
        date: 'December 15, 2025',
        author: 'John Walter',
        category: 'Beauty Trend',
        excerpt: 'Explore the fundamental techniques and indispensable tools needed for thriving in beekeeping. Learn how to',
        image: 'https://ext.same-assets.com/1832031263/3237714711.png',
    },
    {
        id: 4,
        title: 'Skincare Ingredients Trending This Year',
        date: 'December 15, 2025',
        author: 'John Walter',
        category: 'Beauty Trend',
        excerpt: 'Explore the fundamental techniques and indispensable tools needed for thriving in beekeeping. Learn how to',
        image: 'https://ext.same-assets.com/1832031263/4275963709.png',
    },
];

export default function HBlog() {
    const featuredPost = blogPosts.find((post) => post.featured);
    const sidePosts = blogPosts.filter((post) => !post.featured);

    return (
        <section id="blog" className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="font-rumraisin text-primary text-lg mb-2">Our Blog</p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-secondary flex items-center justify-center gap-3">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Latest News & Blog
                        <span className="w-2 h-2 bg-primary rounded-full" />
                    </h2>
                </div>

                {/* Blog Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Featured Post */}
                    {featuredPost && (
                        <div className="group">
                            <div className="overflow-hidden rounded-xl mb-4">
                                <img
                                    src={featuredPost.image}
                                    alt={featuredPost.title}
                                    className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                    {featuredPost.date}
                </span>
                                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                                    {featuredPost.author}
                </span>
                                <span className="text-primary">{featuredPost.category}</span>
                            </div>
                            <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                                {featuredPost.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{featuredPost.excerpt}</p>
                        </div>
                    )}

                    {/* Side Posts */}
                    <div className="space-y-6">
                        {sidePosts.map((post) => (
                            <div key={post.id} className="flex gap-4 group">
                                <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-secondary mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                        {post.date}
                    </span>
                                        <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                                            {post.author}
                    </span>
                                    </div>
                                    <span className="text-xs text-primary">{post.category}</span>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
