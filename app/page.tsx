"use client";

import Header from "./ui/layout/Header";
import Footer from "./ui/layout/Footer";
import AppWrapper from "./ui/AppWrapper";
import { MainUiProvider } from "./contexts/MainUiContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CategoryProvider } from "./contexts/CategoryContext";

export default function Home() {

	return (
		<main >
			<MainUiProvider>
				<AuthProvider>
					<CategoryProvider>
						<div className="h-screen flex flex-col">
							<Header />
							<main className="flex-1 overflow-auto">
								{/* <div className="overflow-y-auto"> */}
									<AppWrapper />
								{/* </div> */}
							</main>
							<Footer />
						</div>
					</CategoryProvider>
				</AuthProvider>
			</MainUiProvider>
		</main>
	)
}
