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
						<Header />
						<AppWrapper />
						<Footer />
					</CategoryProvider>
				</AuthProvider>
			</MainUiProvider>
		</main>

	)
}
